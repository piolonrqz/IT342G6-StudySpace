package cit.edu.studyspace.service;

import cit.edu.studyspace.dto.SpaceCreateDTO;
import cit.edu.studyspace.dto.SpaceUpdateDTO;
import cit.edu.studyspace.entity.SpaceEntity;
import cit.edu.studyspace.repository.SpaceRepo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import jakarta.annotation.PostConstruct;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@Service
@Tag(name = "Space Service", description = "Business logic for space operations")
public class SpaceService {

    private static final Logger logger = LoggerFactory.getLogger(SpaceService.class); // Add logger

    @Autowired
    private SpaceRepo spaceRepo;

    @Autowired
    private FileStorageService fileStorageService; // Keep injection

    @Value("${file.upload-dir}")
    private String spaceImageUploadDir; // Inject space image path property

    private Path spaceImageStorageLocation; // Path object for space images

    @PostConstruct // Initialize the path after properties are injected
    public void init() {
        this.spaceImageStorageLocation = Paths.get(this.spaceImageUploadDir).toAbsolutePath().normalize();
        logger.info("Space image storage location initialized: {}", this.spaceImageStorageLocation);
    }

    // Retrieves all spaces from the database.
    @Operation(summary = "Get all spaces", description = "Fetches all spaces from the database")
    public List<SpaceEntity> getAllSpaces() {
        return spaceRepo.findAll();
    }

    // Retrieves a space by its ID.
    @Operation(summary = "Get space by ID", description = "Fetches a space based on the given ID")
    public Optional<SpaceEntity> getSpaceById(int id) {
        return spaceRepo.findById(id);
    }

    // Creates a new space, including storing an optional image.
    @Operation(summary = "Create a new space", description = "Adds a new space and its optional image to the system")
    public SpaceEntity createSpaceFromDTO(SpaceCreateDTO dto, MultipartFile imageFile) { // Add MultipartFile parameter
        SpaceEntity space = new SpaceEntity();
        space.setName(dto.getName());
        space.setDescription(dto.getDescription());
        space.setLocation(dto.getLocation());
        space.setCapacity(dto.getCapacity());
        space.setSpaceType(dto.getSpaceType());
        space.setAvailable(dto.isAvailable());
        space.setOpeningTime(dto.getOpeningTime());
        space.setClosingTime(dto.getClosingTime());
        space.setPrice(dto.getPrice());

        // Handle image storage
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                String imageFilename = fileStorageService.storeFile(imageFile, this.spaceImageStorageLocation);
                space.setImageFilename(imageFilename); // Set the stored filename
                logger.info("Stored new space image with filename: {}", imageFilename);
            } catch (Exception e) {
                logger.error("Failed to store image for new space '{}'", dto.getName(), e);
                // Decide handling: throw exception, save space without image?
                throw new RuntimeException("Could not store space image file.", e);
            }
        } else {
            space.setImageFilename(null); // Ensure filename is null if no file provided
        }

        // @PrePersist handles createdAt
        return spaceRepo.save(space);
    }

    // Update an existing space, including optional image update.
    @Operation(summary = "Update an existing space", description = "Updates a space based on the given ID and details, handling image replacement and deletion.")
    public SpaceEntity updateSpaceFromDTO(int id, SpaceUpdateDTO dto, MultipartFile imageFile) { // Add MultipartFile parameter
        Optional<SpaceEntity> optionalSpace = spaceRepo.findById(id);
        if (optionalSpace.isPresent()) {
            SpaceEntity existingSpace = optionalSpace.get();
            String oldImageFilename = existingSpace.getImageFilename(); // Store old filename
            String newImageFilename = null;

            // Handle new image upload if provided
            if (imageFile != null && !imageFile.isEmpty()) {
                try {
                    newImageFilename = fileStorageService.storeFile(imageFile, this.spaceImageStorageLocation);
                    logger.info("Stored updated space image with filename: {}", newImageFilename);
                } catch (Exception e) {
                    logger.error("Failed to store updated image for space ID: {}", id, e);
                    throw new RuntimeException("Could not store updated space image file.", e);
                }
            }

            // Update fields from dto
            existingSpace.setName(dto.getName());
            existingSpace.setDescription(dto.getDescription());
            existingSpace.setLocation(dto.getLocation());
            existingSpace.setCapacity(dto.getCapacity());
            existingSpace.setSpaceType(dto.getSpaceType());
            existingSpace.setAvailable(dto.isAvailable());
            existingSpace.setOpeningTime(dto.getOpeningTime());
            existingSpace.setClosingTime(dto.getClosingTime());
            existingSpace.setPrice(dto.getPrice());

            // Handle Image Filename Update and Deletion of Old Image
            if (newImageFilename != null) {
                 // Delete the old image *after* successfully storing the new one
                if (oldImageFilename != null && !oldImageFilename.isBlank()) {
                    // Avoid deleting the same file if it was somehow re-uploaded with the same name (UUID makes this unlikely)
                    if (!newImageFilename.equals(oldImageFilename)) {
                        logger.info("Attempting to delete old space image: {}", oldImageFilename);
                        fileStorageService.deleteFile(oldImageFilename, this.spaceImageStorageLocation);
                    }
                }
                 // Set the new filename only after attempting to delete the old one
                existingSpace.setImageFilename(newImageFilename);
            }
            // Note: If newImageFilename is null, the existing filename remains unchanged.

            // The @PreUpdate annotation in SpaceEntity handles updatedAt
            return spaceRepo.save(existingSpace); // Save the updated entity
        } else {
            logger.warn("Space not found for update with ID: {}", id);
            return null; // Or throw SpaceNotFoundException
        }
    }

    // Deletes a space and its associated image.
    @Operation(summary = "Delete a space", description = "Removes a space and its associated image from the system")
    public String deleteSpace(int id) {
        Optional<SpaceEntity> optionalSpace = spaceRepo.findById(id);
        if (optionalSpace.isPresent()){
            SpaceEntity spaceToDelete = optionalSpace.get();
            String imageFilename = spaceToDelete.getImageFilename();

            // Attempt to delete the associated image file if it exists
            if (imageFilename != null && !imageFilename.isBlank()) {
                 try {
                     logger.info("Attempting to delete space image for space ID {}: {}", id, imageFilename);
                     fileStorageService.deleteFile(imageFilename, this.spaceImageStorageLocation); // Pass path
                 } catch (Exception e) {
                    // Log the error but proceed with deleting the DB record
                    logger.error("Error deleting associated image file '{}' for space ID {}: {}", imageFilename, id, e.getMessage());
                 }
            }

            // Delete the database record
            spaceRepo.deleteById(id);
            logger.info("Space record successfully deleted for ID: {}", id);
            return "Space Successfully Deleted!";
        } else {
            logger.warn("Space not found for deletion with ID: {}", id);
            return "Space not found";
        }
    }
}
