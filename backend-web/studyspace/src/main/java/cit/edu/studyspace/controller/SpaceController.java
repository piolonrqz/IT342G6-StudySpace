package cit.edu.studyspace.controller;

import cit.edu.studyspace.dto.SpaceCreateDTO;
import cit.edu.studyspace.dto.SpaceUpdateDTO;
import cit.edu.studyspace.entity.SpaceEntity;
import cit.edu.studyspace.service.SpaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import cit.edu.studyspace.service.FileStorageService;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/space")
@Tag(name = "Space API", description = "Operations related to bookings")
public class SpaceController {
    
    @Autowired
    private SpaceService spaceService;

    @Autowired // Inject FileStorageService
    private FileStorageService fileStorageService;

    // Check
    @GetMapping("/test")
    @Operation(summary = "Test Connection", description = "Test API Connection - must return 'Hello, Space! Test' and '200'")
    public String print() {
        return "Hello, Space! Test";
    }

    @GetMapping("/getAll")
    @Operation(summary = "Get all space", description = "Fetches all spaces in the system")
    public List<SpaceEntity> getAllSpaces() {
        return spaceService.getAllSpaces();
    }

    // Restore multipart/form-data handling using DTO
    @PostMapping(value = "/save", consumes = {"multipart/form-data"}) 
    @Operation(summary = "Create a new space with optional image", description = "Adds a new space (using DTO) and optionally its image to the system")
    public ResponseEntity<SpaceEntity> saveSpace(
            // Receive SpaceCreateDTO JSON data in a part named "spaceData"
            @RequestPart("spaceData") SpaceCreateDTO spaceDTO, 
             // Receive the image file in a part named "imageFile" (optional)
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile 
         ) {

        String imageFilename = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            // Store the file and get the unique filename
            imageFilename = fileStorageService.storeFile(imageFile); 
             // Set the filename in the DTO received from the request part
            spaceDTO.setImageFilename(imageFilename); 
        } else {
             // Ensure filename is null if no file is uploaded
             spaceDTO.setImageFilename(null);
        }

        // Save the entity using the DTO (which now includes the image filename if uploaded)
        SpaceEntity savedSpace = spaceService.createSpaceFromDTO(spaceDTO); 
        
        return ResponseEntity.ok(savedSpace);
    }

    // Restore multipart/form-data handling for update using DTO
    @PutMapping(value = "/update/{id}", consumes = {"multipart/form-data"}) // Specify consumes
    @Operation(summary = "Update an existing space with optional image", description = "Updates the details (using DTO) and optionally the image of a space")
    public ResponseEntity<SpaceEntity> updateSpace(
            @PathVariable int id,
            // Receive SpaceUpdateDTO JSON data in a part named "spaceData"
            @RequestPart("spaceData") SpaceUpdateDTO updateDTO,
             // Receive the new image file in a part named "imageFile" (optional)
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile 
        ) {
        
        // Check if a new image file was uploaded
        if (imageFile != null && !imageFile.isEmpty()) {
            // If yes, store it and get the new filename
            String newImageFilename = fileStorageService.storeFile(imageFile);
            // Set the new filename in the DTO. The service layer will handle deleting the old file.
            updateDTO.setImageFilename(newImageFilename); 
        } else {
            // If no new file is uploaded, we don't explicitly set the filename here.
            // The service layer's update logic will check if the DTO's filename is different
            // from the existing one. If the frontend doesn't send an imageFilename in the DTO 
            // when no file is uploaded, the existing image should be preserved by default
            // unless the DTO explicitly contains a null filename.
             // Important: Ensure your SpaceUpdateDTO doesn't get a default non-null filename 
             // if no file is uploaded and no explicit filename is passed in the 'spaceData' part.
             // Setting it null here if no file is uploaded ensures the service knows no *new* file was intended.
             // However, ONLY set null if you want "no new file" to mean "keep old file".
             // If you want "no new file" to mean "remove existing file", that logic needs adjustment here and in the service.
             // Let's assume for now: no new file = keep existing filename implicitly OR if DTO receives null, service handles it
             // The safest approach is to ONLY set the filename in the DTO if a NEW file is uploaded.
             // updateDTO.setImageFilename(null); // <--- Avoid this unless you intend to remove image when no file is uploaded
        }

        // Call the update service method with the DTO
        SpaceEntity updatedSpace = spaceService.updateSpaceFromDTO(id, updateDTO); 
        
        if (updatedSpace != null) {
            return ResponseEntity.ok(updatedSpace);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Delete a space", description = "Removes a space from the system by its ID") // Added Operation annotation
    public ResponseEntity<String> deleteSpace(@PathVariable int id){ // Changed return type for clarity
        String result = spaceService.deleteSpace(id);
        // You might want to return specific status codes based on the result
        if ("Space Successfully Deleted!".equals(result)) { // Compare result string
            return ResponseEntity.ok(result);
        } else if ("Space not found".equals(result)){
             return ResponseEntity.notFound().build(); // Return 404 if not found
        } else {
            // Handle other potential errors (e.g., internal server error)
            return ResponseEntity.status(500).body(result); 
        }
    }
}
