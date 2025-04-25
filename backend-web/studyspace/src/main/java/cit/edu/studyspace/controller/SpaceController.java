package cit.edu.studyspace.controller;

import cit.edu.studyspace.dto.SpaceCreateDTO;
import cit.edu.studyspace.dto.SpaceListDTO;
import cit.edu.studyspace.dto.SpaceUpdateDTO;
import cit.edu.studyspace.entity.SpaceEntity;
import cit.edu.studyspace.service.FileStorageService;
import cit.edu.studyspace.service.SpaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/space")
@Tag(name = "Space API", description = "Operations related to spaces")
public class SpaceController {

    @Autowired
    private SpaceService spaceService;

    @Autowired
    private FileStorageService fileStorageService;

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

        String imageFilename = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            imageFilename = fileStorageService.storeFile(imageFile); 
            spaceDTO.setImageFilename(imageFilename); 
        } else {
            spaceDTO.setImageFilename(null);
        }

        SpaceEntity savedSpace = spaceService.createSpaceFromDTO(spaceDTO); 
        
        return ResponseEntity.ok(savedSpace);
    }

    // Restore multipart/form-data handling for update using DTO
    @PutMapping(value = "/update/{id}", consumes = {"multipart/form-data"})
    @Operation(summary = "Update an existing space with optional image", description = "Updates the details (using DTO) and optionally the image of a space")
    public ResponseEntity<SpaceListDTO> updateSpace( // Changed return type
            @PathVariable int id,
            @RequestPart("spaceData") SpaceUpdateDTO updateDTO,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile 
        ) {
        
        String imageFilename = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            // If a new image is uploaded, store it and update the DTO
            imageFilename = fileStorageService.storeFile(imageFile); 
            updateDTO.setImageFilename(imageFilename); 
        } else {
             // If no new image is uploaded, explicitly set filename in DTO to null 
             // to avoid accidentally clearing it if the DTO field wasn't sent.
             // The service layer should handle preserving the old filename if this is null.
             // Alternatively, fetch the existing space first to get the current filename if needed.
             // For simplicity, we assume the service handles null filename means "no change".
             // updateDTO.setImageFilename(null); // Or fetch existing and set it if needed
        }
        
        try {
            SpaceEntity updatedSpace = spaceService.updateSpaceFromDTO(id, updateDTO); 
            
            if (updatedSpace != null) {
                // Convert the updated entity to DTO before returning
                return ResponseEntity.ok(convertToDTO(updatedSpace)); 
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            // Log the exception details
            // Consider returning a more specific error response if needed
            System.err.println("Error updating space: " + e.getMessage()); // Replace with proper logging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // Or return an error DTO
        }
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Delete a space", description = "Removes a space from the system by its ID")
    public ResponseEntity<String> deleteSpace(@PathVariable int id){
        String result = spaceService.deleteSpace(id);
        
        if (result.equals("Space not found")) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(result);
        }
    }
}
