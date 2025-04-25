package cit.edu.studyspace.controller;

import cit.edu.studyspace.dto.SpaceCreateDTO;
import cit.edu.studyspace.dto.SpaceListDTO;
import cit.edu.studyspace.dto.SpaceUpdateDTO;
import cit.edu.studyspace.entity.SpaceEntity;
import cit.edu.studyspace.service.SpaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/space")
@Tag(name = "Space API", description = "Operations related to spaces")
public class SpaceController {

    private static final Logger logger = LoggerFactory.getLogger(SpaceController.class);

    @Autowired
    private SpaceService spaceService;

    // Check
    @GetMapping("/test")
    @Operation(summary = "Test Connection", description = "Test API Connection - must return 'Hello, Space! Test' and '200'")
    public String print() {
        return "Hello, Space! Test";
    }

    @GetMapping("/getAll")
    @Operation(summary = "Get all spaces", description = "Fetches all spaces in the system as DTOs to prevent circular references")
    public List<SpaceListDTO> getAllSpaces() {
        List<SpaceEntity> spaces = spaceService.getAllSpaces();
        return spaces.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Convert SpaceEntity to SpaceListDTO
    private SpaceListDTO convertToDTO(SpaceEntity space) {
        SpaceListDTO dto = new SpaceListDTO();
        dto.setId(space.getId());
        dto.setName(space.getName());
        dto.setDescription(space.getDescription());
        dto.setLocation(space.getLocation());
        dto.setCapacity(space.getCapacity());
        dto.setImageFilename(space.getImageFilename());
        dto.setPrice(space.getPrice());
        dto.setOpeningTime(space.getOpeningTime());
        dto.setClosingTime(space.getClosingTime());
        dto.setSpaceType(space.getSpaceType()); // Add mapping for spaceType
        dto.setAvailable(space.isAvailable()); // Add mapping for isAvailable
        return dto;
    }

    // Add this new endpoint to get a single space by ID
    @GetMapping("/{id}")
    @Operation(summary = "Get space by ID", description = "Fetches a single space by its ID as a DTO to prevent circular references")
    public ResponseEntity<SpaceListDTO> getSpaceById(@PathVariable int id) {
        Optional<SpaceEntity> spaceOptional = spaceService.getSpaceById(id);
        return spaceOptional
                .map(space -> ResponseEntity.ok(convertToDTO(space)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Restore multipart/form-data handling using DTO
    @PostMapping(value = "/save", consumes = {"multipart/form-data"}) 
    @Operation(summary = "Create a new space with optional image", description = "Adds a new space (using DTO) and optionally its image to the system")
    public ResponseEntity<SpaceEntity> saveSpace(
            @RequestPart("spaceData") SpaceCreateDTO spaceDTO,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile
         ) {
        try {
            // Pass DTO and file to service
            SpaceEntity savedSpace = spaceService.createSpaceFromDTO(spaceDTO, imageFile);
            logger.info("Successfully created space with ID: {}", savedSpace.getId());
            return ResponseEntity.ok(savedSpace);
        } catch (Exception e) {
             logger.error("Error creating space: {}", e.getMessage(), e);
             // Consider returning a more specific error response
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Restore multipart/form-data handling for update using DTO
    @PutMapping(value = "/update/{id}", consumes = {"multipart/form-data"})
    @Operation(summary = "Update an existing space with optional image", description = "Updates the details (using DTO) and optionally the image of a space")
    public ResponseEntity<SpaceListDTO> updateSpace( // Changed return type
            @PathVariable int id,
            @RequestPart("spaceData") SpaceUpdateDTO updateDTO,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile 
        ) {
        try {
            // Pass ID, DTO, and file to service
            SpaceEntity updatedSpace = spaceService.updateSpaceFromDTO(id, updateDTO, imageFile);

            if (updatedSpace != null) {
                logger.info("Successfully updated space with ID: {}", id);
                return ResponseEntity.ok(convertToDTO(updatedSpace));
            } else {
                logger.warn("Space not found for update with ID: {}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error updating space ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Delete a space", description = "Removes a space and its associated image from the system") // Updated description
    public ResponseEntity<String> deleteSpace(@PathVariable int id){
        try {
            String result = spaceService.deleteSpace(id);
            if (result.equals("Space not found")) {
                logger.warn("Attempted to delete non-existent space ID: {}", id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
            } else {
                logger.info("Successfully deleted space ID: {}", id);
                return ResponseEntity.ok(result);
            }
        } catch (Exception e) {
             logger.error("Error deleting space ID {}: {}", id, e.getMessage(), e);
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting space.");
        }
    }
}
