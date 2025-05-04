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
import cit.edu.studyspace.dto.PasswordChangeDTO; // Add import for PasswordChangeDTO
import cit.edu.studyspace.dto.PasswordSetDTO; // Import the new DTO
import jakarta.validation.Valid; // Add import for @Valid

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpStatus; // Import HttpStatus
import org.springframework.http.MediaType; // Import MediaType
import org.springframework.web.multipart.MultipartFile; // Import MultipartFile
import org.slf4j.Logger; // Use SLF4J Logger
import org.slf4j.LoggerFactory; // Use SLF4J Logger
import org.springframework.dao.DataIntegrityViolationException; // Import DataIntegrityViolationException

import org.springframework.web.bind.annotation.*;

import java.util.Collections;
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

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final JwtUtil jwtUtil;

    public UserController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }


    // Check API Connection
    @GetMapping("/print")
    public Map<String, String> getGreeting() {
        return Collections.singletonMap("message", "Hello from Spring Boot!");
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
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
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
    public ResponseEntity<?> updateUser( // Changed return type to ResponseEntity<?> to allow error objects
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
        } catch (DataIntegrityViolationException e) { // Catch specific constraint violation
            logger.error("Data integrity violation during user update for ID {}: {}", id, e.getMessage());
            // Check if the error is due to the unique email constraint
            if (e.getMessage() != null && e.getMessage().contains("UK4xad1enskw4j1t2866f7sodrx")) { // Check for specific constraint name
                 return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Email already exists."));
            }
            // Handle other data integrity issues if necessary, otherwise return a generic bad request
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Data integrity violation."));
        } catch (IllegalArgumentException e) {
             logger.error("Invalid argument during user update for ID {}: {}", id, e.getMessage());
             // Return specific error message for invalid role
             if (e.getMessage() != null && e.getMessage().startsWith("Invalid role provided")) {
                 return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
             }
             return ResponseEntity.badRequest().body(Map.of("error", "Invalid data provided.")); // Generic invalid data message
        } catch (RuntimeException e) {
            logger.error("Error updating user ID {}: {}", id, e.getMessage(), e);
            // Handle potential file storage exceptions from the service more specifically if needed
            if (e.getMessage() != null && e.getMessage().contains("Could not store profile picture file")) {
                 return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Failed to save profile picture."));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "An unexpected error occurred during update.")); // Generic internal server error
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

    // Endpoint to change user password
    @PutMapping("/change-password/{id}")
    @Operation(summary = "Change user password", description = "Allows a user to change their password")
    public ResponseEntity<?> changePassword(@PathVariable int id, @RequestBody @Valid PasswordChangeDTO passwordChangeDTO) {
        try {
            // Basic check: Ensure the user making the request is the user whose password is being changed
            // (More robust checks might involve comparing with authenticated principal)
            // For simplicity, we'll rely on the frontend sending the correct ID for the logged-in user.

            userService.changePassword(id, passwordChangeDTO.getCurrentPassword(), passwordChangeDTO.getNewPassword());
            logger.info("Password change request successful for user ID: {}", id);
            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        } catch (RuntimeException e) {
            logger.error("Password change failed for user ID {}: {}", id, e.getMessage());
            // Return specific error messages based on the exception
            if ("User not found".equals(e.getMessage())) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
            } else if ("Incorrect current password".equals(e.getMessage())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
            } else if (e.getMessage() != null && e.getMessage().startsWith("User does not have a password set")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
            }
            // Handle other potential errors (like validation errors from @Valid)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Password change failed: " + e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error during password change for user ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "An unexpected error occurred."));
        }
    }

    // Endpoint to set user password (for users without one)
    @PostMapping("/set-password/{id}")
    @Operation(summary = "Set user password", description = "Sets the initial password for a user who doesn\'t have one")
    public ResponseEntity<?> setPassword(@PathVariable int id, @RequestBody @Valid PasswordSetDTO passwordSetDTO) {
        try {
            // Similar basic check as changePassword
            userService.setPassword(id, passwordSetDTO.getNewPassword());
            logger.info("Password set request successful for user ID: {}", id);
            return ResponseEntity.ok(Map.of("message", "Password set successfully"));
        } catch (RuntimeException e) {
            logger.error("Password set failed for user ID {}: {}", id, e.getMessage());
            // Return specific error messages based on the exception
            if ("User not found".equals(e.getMessage())) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
            } else if (e.getMessage() != null && e.getMessage().startsWith("User already has a password set")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
            }
            // Handle other potential errors (like validation errors from @Valid)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Password set failed: " + e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error during password set for user ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "An unexpected error occurred."));
        }
    }
}
