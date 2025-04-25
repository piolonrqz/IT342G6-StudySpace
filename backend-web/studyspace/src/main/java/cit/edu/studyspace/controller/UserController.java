package cit.edu.studyspace.controller;

import cit.edu.studyspace.config.JwtUtil;
import cit.edu.studyspace.entity.UserEntity;
import cit.edu.studyspace.entity.UserRole;
import cit.edu.studyspace.service.UserService;
import cit.edu.studyspace.repository.UserRepo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import cit.edu.studyspace.dto.UserCreateDTO;
import cit.edu.studyspace.dto.UserUpdateDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus; // Import HttpStatus
import org.springframework.http.MediaType; // Import MediaType
import org.springframework.web.multipart.MultipartFile; // Import MultipartFile
import org.slf4j.Logger; // Use SLF4J Logger
import org.slf4j.LoggerFactory; // Use SLF4J Logger

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User API", description = "Operations related to users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class); // Add logger

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepo userRepo;

    private final JwtUtil jwtUtil;

    public UserController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }


    // Check API Connection
    @GetMapping("/test")
    @Operation(summary = "Test Connection", description = "Test API Connection - must return 'Hello, User! Test' and '200'")
    public String print() {
        return "Hello, User! Test";
    }

    // Login - Generate JWT Token and return user details
    @PostMapping("/login")
    @Operation(summary = "User authentication", description = "Authenticates user and returns JWT token and user details")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) { // Renamed param for clarity
        String email = loginData.get("email");
        String password = loginData.get("password");
    
        try {
            // Call the updated service method which returns a Map
            Map<String, Object> authResult = userService.authenticateUser(email, password); 
            
            // Return the map containing token and user details
            return ResponseEntity.ok(authResult); 

        } catch (RuntimeException e) {
            // Handle authentication failure (e.g., invalid credentials)
            // Return a 401 Unauthorized status
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage()); // Send back the error message
            return ResponseEntity.status(401).body(errorResponse);
        } catch (Exception e) {
             // Catch other potential errors during login
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "An unexpected error occurred during login.");
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user", description = "Returns the currently authenticated user's details")
    public ResponseEntity<Map<String, Object>> getCurrentUser(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String userId = jwtUtil.extractUserId(token);
            String email = jwtUtil.extractEmail(token);
            
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("userId", userId);
            userInfo.put("email", email);
            userInfo.put("firstName", jwtUtil.extractFirstName(token));
            userInfo.put("lastName", jwtUtil.extractLastName(token));
            
            return ResponseEntity.ok(userInfo);
        }
        
        return ResponseEntity.status(401).build();
    }
    
    // Check Email uniqueness
    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmailUnique(@RequestParam String email) {
        boolean exists = userRepo.existsByEmail(email);
        return ResponseEntity.ok(!exists); // true if unique
    }

    @GetMapping("/getAll")
    @Operation(summary = "Get all users", description = "Fetches all users in the system")
    public ResponseEntity<List<UserEntity>> getAllUsers() {
        try {
            List<UserEntity> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            // Log the error
            System.err.println("Error fetching users: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/save")
    @Operation(summary = "Create a new user", description = "Adds a new user to the system")
    public ResponseEntity<UserEntity> saveUser(@RequestBody UserCreateDTO dto) {
        UserEntity user = new UserEntity();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setEmailVerified(dto.isEmailVerified());
        user.setCreatedAt(dto.getCreatedAt());
        user.setUpdatedAt(dto.getUpdatedAt());
        user.setLastLogin(dto.getLastLogin());
        user.setRole(UserRole.valueOf(dto.getRole()));

        UserEntity savedUser = userService.saveUser(user);
        return ResponseEntity.ok(savedUser);
    }


    @PutMapping(value = "/update/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE}) // Consume multipart
    @Operation(summary = "Update user", description = "Update user using DTO and optionally upload a profile picture")
    public ResponseEntity<UserEntity> updateUser(
            @PathVariable int id,
            @RequestPart("userData") UserUpdateDTO dto, // User data as JSON part
            @RequestPart(value = "profilePictureFile", required = false) MultipartFile profilePictureFile // Optional file part
    ) {
        try {
            logger.info("Received request to update user ID: {}", id);
            UserEntity updated = userService.updateUserFromDTO(id, dto, profilePictureFile); // Pass file to service
            if (updated != null) {
                logger.info("Successfully updated user ID: {}", id);
                return ResponseEntity.ok(updated);
            } else {
                logger.warn("User not found for update with ID: {}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (IllegalArgumentException e) {
             logger.error("Invalid argument during user update for ID {}: {}", id, e.getMessage());
             return ResponseEntity.badRequest().body(null); // Or return an error object
        } catch (RuntimeException e) {
            logger.error("Error updating user ID {}: {}", id, e.getMessage(), e);
            // Handle potential file storage exceptions from the service
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // Or return an error object
        }
    }


    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Delete a user", description = "Removes a user and their profile picture") // Updated description
    public ResponseEntity<String> deleteUser(@PathVariable int id){ // Return ResponseEntity
        try {
            String result = userService.deleteUser(id);
            if (result.endsWith("NOT FOUND!")) {
                 logger.warn("Attempted to delete non-existent user ID: {}", id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
            } else {
                 logger.info("Successfully deleted user ID: {}", id);
                return ResponseEntity.ok(result);
            }
        } catch (Exception e) {
             logger.error("Error deleting user ID {}: {}", id, e.getMessage(), e);
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting user.");
        }
    }
}
