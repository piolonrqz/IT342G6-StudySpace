package cit.edu.studyspace.controller;

import cit.edu.studyspace.entity.Space;
import cit.edu.studyspace.service.SpaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
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
    public List<Space> getAllSpaces() {
        return spaceService.getAllSpaces();
    }

    @PostMapping("/save")
    @Operation(summary = "Create a new space", description = "Adds a new space to the system")
    public Space saveBooking(@RequestBody Space space) {

        Space savedSpace = space;
        
        return savedSpace;
    }
}
