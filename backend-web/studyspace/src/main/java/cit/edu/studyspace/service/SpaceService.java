package cit.edu.studyspace.service;

import cit.edu.studyspace.dto.SpaceCreateDTO;
import cit.edu.studyspace.dto.SpaceUpdateDTO;
import cit.edu.studyspace.entity.SpaceEntity;
import cit.edu.studyspace.repository.SpaceRepo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
@Tag(name = "Space Service", description = "Business logic for space operations")
public class SpaceService {

    @Autowired
    private SpaceRepo spaceRepo;

    // Inject FileStorageService
    @Autowired 
    private FileStorageService fileStorageService; 

    // Constructor (if needed for other purposes, keep it; otherwise, autowiring fields is sufficient)
    public SpaceService(){
        super();
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

    // Creates a new space.
    @Operation(summary = "Create a new space", description = "Adds a new space to the system")
    public SpaceEntity createSpaceFromDTO(SpaceCreateDTO dto) {
        SpaceEntity space = new SpaceEntity();
        space.setName(dto.getName());
        space.setDescription(dto.getDescription());
        space.setLocation(dto.getLocation());
        space.setCapacity(dto.getCapacity());
        space.setSpaceType(dto.getSpaceType());
        space.setAvailable(dto.isAvailable());
        space.setOpeningTime(dto.getOpeningTime());
        space.setClosingTime(dto.getClosingTime());
        space.setImageFilename(dto.getImageFilename());
        space.setPrice(dto.getPrice());

        return spaceRepo.save(space);
    }

    // Update an existing space
    @Operation(summary = "Update an existing space", description = "Updates a space based on the given ID and details, deleting the old image if a new one is provided.")
    public SpaceEntity updateSpaceFromDTO(int id, SpaceUpdateDTO dto) {
        Optional<SpaceEntity> optionalSpace = spaceRepo.findById(id);
        if (optionalSpace.isPresent()) {
            SpaceEntity existingSpace = optionalSpace.get();
            String oldImageFilename = existingSpace.getImageFilename(); // Store old filename
            // Get potential new filename from dto
            String newImageFilename = dto.getImageFilename(); // Use dto

            // Update fields from dto
            existingSpace.setName(dto.getName()); // Use dto
            existingSpace.setDescription(dto.getDescription()); // Use dto
            existingSpace.setLocation(dto.getLocation()); // Use dto
            existingSpace.setCapacity(dto.getCapacity()); // Use dto
            existingSpace.setSpaceType(dto.getSpaceType()); // Use dto
            existingSpace.setAvailable(dto.isAvailable()); // Use dto
            existingSpace.setOpeningTime(dto.getOpeningTime()); // Use dto
            existingSpace.setClosingTime(dto.getClosingTime()); // Use dto

            // Handle Image Update and Deletion of Old Image (logic remains the same, variable checked is newImageFilename from dto)
            // Check if a *new* filename is provided and it's *different* from the old one
            if (newImageFilename != null && !newImageFilename.equals(oldImageFilename)) {
                // If there was an old image, attempt to delete it
                if (oldImageFilename != null && !oldImageFilename.isBlank()) {
                    try {
                        fileStorageService.deleteFile(oldImageFilename);
                        System.out.println("Old image deleted: " + oldImageFilename); // Log success
                    } catch (Exception e) {
                         // Log error but continue with the update process
                        System.err.println("Error deleting old image file '" + oldImageFilename + "': " + e.getMessage());
                    }
                }
                 // Set the new filename only after attempting to delete the old one
                existingSpace.setImageFilename(newImageFilename);
            }
            // Optional: Add logic here if you need to handle setting the image to null
            // (i.e., removing the image without replacing it).

            // Update price separately using dto
            existingSpace.setPrice(dto.getPrice()); // Use dto

            // The @PreUpdate annotation in SpaceEntity handles updatedAt
            return spaceRepo.save(existingSpace); // Save the updated entity
        } else {
            // Return null or throw an exception if the space is not found
            return null;
        }
    }


    // Deletes a user by their ID.
    // Refactored to use Optional and return clearer messages
    // Now also deletes the associated image file.
    @Operation(summary = "Delete a space", description = "Removes a space and its associated image from the system")
    public String deleteSpace(int id) {
        Optional<SpaceEntity> optionalSpace = spaceRepo.findById(id);
        if (optionalSpace.isPresent()){
            SpaceEntity spaceToDelete = optionalSpace.get();
            String imageFilename = spaceToDelete.getImageFilename();

            // Attempt to delete the associated image file if it exists
            if (imageFilename != null && !imageFilename.isBlank()) {
                 try {
                     fileStorageService.deleteFile(imageFilename);
                     System.out.println("Associated image deleted: " + imageFilename); // Log success
                 } catch (Exception e) {
                    // Log the error but proceed with deleting the DB record
                    System.err.println("Error deleting associated image file '" + imageFilename + "': " + e.getMessage()); 
                    // Depending on requirements, you might want to handle this error differently
                    // (e.g., return a specific error message, or prevent DB deletion if file deletion fails)
                 }
            }

            // Delete the database record
            spaceRepo.deleteById(id); 
            return "Space Successfully Deleted!";
        } else {
            return "Space not found";
        }
    }
}
