package cit.edu.studyspace.controller;

import cit.edu.studyspace.entity.SpaceEntity;
import cit.edu.studyspace.entity.SpaceType;
import cit.edu.studyspace.service.SpaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import cit.edu.studyspace.service.FileStorageService;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Locale;

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

    // Updated to handle multipart/form-data including image file
    @PostMapping(value = "/save", consumes = {"multipart/form-data"}) // Specify consumes
    @Operation(summary = "Create a new space with image", description = "Adds a new space and its image to the system")
    public ResponseEntity<SpaceEntity> saveSpace(
            // Use @RequestParam for form fields
            @RequestParam("name") String name,
            @RequestParam("location") String location,
            @RequestParam("capacity") int capacity,
            @RequestParam("spaceType") String spaceTypeStr, // Read as String
            @RequestParam("openingTime") String openingTimeStr, // Receive times as strings
            @RequestParam("closingTime") String closingTimeStr,
            @RequestParam("price") BigDecimal price,
            @RequestParam("available") boolean available,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile // Image file is optional on save? Adjust required=true if mandatory
         ) {

        String imageFilename = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            imageFilename = fileStorageService.storeFile(imageFile); // Store the file
        }

        // Create and populate the entity
        SpaceEntity space = new SpaceEntity();
        space.setName(name);
        space.setLocation(location);
        space.setCapacity(capacity);

        // Convert String to SpaceType Enum (handle potential errors)
        try {
            // Assuming your enum constants are uppercase (e.g., STUDY_ROOM, MEETING_POD)
            // Adjust the conversion based on your actual enum definition
           SpaceType type = SpaceType.valueOf(spaceTypeStr.toUpperCase(Locale.ROOT).replace(" ", "_")); 
           space.setSpaceType(type); // Set the Enum value
       } catch (IllegalArgumentException e) {
           // Handle the case where the string doesn't match any enum constant
           // You might want to return a BadRequest ResponseEntity here
            return ResponseEntity.badRequest().body(null); // Or a custom error response
           // Or throw a custom exception
       }
        // Parse time strings - add error handling as needed
        space.setOpeningTime(openingTimeStr); 
        space.setClosingTime(closingTimeStr);
        space.setPrice(price);
        space.setAvailable(available);
        space.setImageFilename(imageFilename); // Set the stored filename

        SpaceEntity savedSpace = spaceService.saveSpace(space); // Use the existing service method
        
        return ResponseEntity.ok(savedSpace);
    }

    // Updated to handle multipart/form-data including optional image file update
    @PutMapping(value = "/update/{id}", consumes = {"multipart/form-data"}) // Specify consumes
    @Operation(summary = "Update an existing space with optional image", description = "Updates the details and optionally the image of a space identified by its ID")
    public ResponseEntity<SpaceEntity> updateSpace(
            @PathVariable int id,
             // Use @RequestParam for form fields
            @RequestParam("name") String name,
            @RequestParam("location") String location,
            @RequestParam("capacity") int capacity,
            @RequestParam("spaceType") String spaceTypeStr, // Read as String
            @RequestParam("openingTime") String openingTimeStr, // Receive times as strings
            @RequestParam("closingTime") String closingTimeStr,
            @RequestParam("price") BigDecimal price,
            @RequestParam("available") boolean available,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile // Image file is optional for update
        ) {

        // Create a temporary entity or DTO with the updated details
        // Alternatively, fetch the existing entity first to update it
        SpaceEntity spaceDetails = new SpaceEntity();
        spaceDetails.setName(name);
        spaceDetails.setLocation(location);
        spaceDetails.setCapacity(capacity);
        try {
            // Assuming your enum constants are uppercase (e.g., STUDY_ROOM, MEETING_POD)
            // Adjust the conversion based on your actual enum definition
           SpaceType type = SpaceType.valueOf(spaceTypeStr.toUpperCase(Locale.ROOT).replace(" ", "_")); 
           spaceDetails.setSpaceType(type);
       } catch (IllegalArgumentException e) {
           // Handle the case where the string doesn't match any enum constant
           // You might want to return a BadRequest ResponseEntity here
            return ResponseEntity.badRequest().body(null); // Or a custom error response
           // Or throw a custom exception
       }
        spaceDetails.setOpeningTime(openingTimeStr); // Add parsing/validation
        spaceDetails.setClosingTime(closingTimeStr); // Add parsing/validation
        spaceDetails.setPrice(price);
        spaceDetails.setAvailable(available);
        // Don't set imageFilename yet

        // Handle optional image update
        if (imageFile != null && !imageFile.isEmpty()) {
            // Optional: Delete the old file before storing the new one
            // SpaceEntity existingSpace = spaceService.getSpaceById(id); // Need a method like this in SpaceService
            // if (existingSpace != null && existingSpace.getImageFilename() != null) {
            //     fileStorageService.deleteFile(existingSpace.getImageFilename()); // Need deleteFile in FileStorageService
            // }
            
            String newImageFilename = fileStorageService.storeFile(imageFile);
            spaceDetails.setImageFilename(newImageFilename); // Set the *new* filename
        } else {
            // If no new file, the service should preserve the existing filename
             spaceDetails.setImageFilename(null); // Or fetch existing and set it explicitly if service doesn't handle null
        }

        // Call the update method in the service
        // The service needs to handle the case where imageFilename in spaceDetails is null (meaning don't update it)
        // or explicitly handle merging based on whether a new file was uploaded.
        SpaceEntity updatedSpace = spaceService.updateSpace(id, spaceDetails); 
        
        // ... unchanged response handling ...
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
