package cit.edu.studyspace.controller;

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

    // Updated to use @RequestPart for both entity data and image file
    @PostMapping(value = "/save", consumes = {"multipart/form-data"}) 
    @Operation(summary = "Create a new space with image", description = "Adds a new space and its image to the system")
    public ResponseEntity<SpaceEntity> saveSpace(
            // Receive SpaceEntity JSON data in a part named "spaceData"
            @RequestPart("spaceData") SpaceEntity spaceData, 
             // Receive the image file in a part named "imageFile" (optional)
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile 
         ) {

        String imageFilename = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            // Store the file and get the unique filename
            imageFilename = fileStorageService.storeFile(imageFile); 
             // Set the filename in the entity received from the request part
            spaceData.setImageFilename(imageFilename); 
        } else {
             // Ensure filename is null if no file is uploaded
             spaceData.setImageFilename(null);
        }

        // Save the entity (which now includes the image filename if uploaded)
        SpaceEntity savedSpace = spaceService.saveSpace(spaceData); 
        
        return ResponseEntity.ok(savedSpace);
    }

    // Updated to handle multipart/form-data including optional image file update
    // Consider applying a similar @RequestPart approach to the updateSpace method as well
    @PutMapping(value = "/update/{id}", consumes = {"multipart/form-data"}) // Specify consumes
    @Operation(summary = "Update an existing space with optional image", description = "Updates the details and optionally the image of a space identified by its ID")
    public ResponseEntity<SpaceEntity> updateSpace(
            @PathVariable int id,
            // Use @RequestPart for fields (similar pattern can be applied here)
            @RequestPart("spaceData") SpaceEntity updatedData,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile 
        ) {
        
        // Handle file storage...
        String newImageFilename = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            newImageFilename = fileStorageService.storeFile(imageFile);
            updatedData.setImageFilename(newImageFilename); // Set the new filename if image provided
        } 

        // Call the update method in the service
        SpaceEntity updatedSpace = spaceService.updateSpace(id, updatedData); // Adjust service method if needed
        
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
