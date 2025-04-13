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

import java.util.List;

@RestController
@RequestMapping("/api/space")
@Tag(name = "Space API", description = "Operations related to bookings")
public class SpaceController {
    
    @Autowired
    private SpaceService spaceService;

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

    @PostMapping("/save")
    @Operation(summary = "Create a new space", description = "Adds a new space to the system")
    public ResponseEntity<SpaceEntity> saveSpace(@RequestBody SpaceCreateDTO spaceDTO) {
        SpaceEntity savedSpace = spaceService.createSpaceFromDTO(spaceDTO);
        return ResponseEntity.ok(savedSpace);
    }

    @PutMapping("/update/{id}")
    @Operation(summary = "Update space", description = "Update space using DTO")
    public ResponseEntity<SpaceEntity> updateSpace(@PathVariable int id, @RequestBody SpaceUpdateDTO dto) {
        SpaceEntity updated = spaceService.updateSpaceFromDTO(id, dto);
        if (updated != null) {
            return ResponseEntity.ok(updated);
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
