package cit.edu.studyspace.service;

import cit.edu.studyspace.config.JwtUtil;
import cit.edu.studyspace.dto.UserUpdateDTO;
import cit.edu.studyspace.entity.UserEntity;
import cit.edu.studyspace.entity.UserRole;
import cit.edu.studyspace.repository.UserRepo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Optional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Tag(name = "User Service", description = "Business logic for user operations")
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepo userRepo;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private FileStorageService fileStorageService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final String PROFILE_PICTURE_FOLDER = "profile_pictures/";

    @PostConstruct
    public void init() {
        logger.info("UserService initialized");
    }

    // Retrieves all users from the database.
    @Operation(summary = "Get all users", description = "Fetches all users from the database")
    public List<UserEntity> getAllUsers() {
        return userRepo.findAll();
    }

    public boolean existsByEmail(String email) {
        return userRepo.existsByEmail(email);
    }

    // Change return type from String to Map<String, Object>
    public Map<String, Object> authenticateUser(String email, String password) { 
        UserEntity user = userRepo.findByEmail(email);
        
        // Basic plaintext password comparison (Consider using Spring Security's PasswordEncoder)
        if (user != null && passwordEncoder.matches(password, user.getPassword())) { 
            // User authenticated successfully
            String token = jwtUtil.generateToken(user); // Generate JWT token

            // Create a map to hold the response data
            Map<String, Object> authResponse = new HashMap<>();
            authResponse.put("token", token);
            // Include all necessary user details for the frontend context
            authResponse.put("id", user.getId());
            authResponse.put("firstName", user.getFirstName());
            authResponse.put("lastName", user.getLastName());
            authResponse.put("email", user.getEmail()); // Include email
            authResponse.put("phoneNumber", user.getPhoneNumber()); // Include phone number
            authResponse.put("role", user.getRole().name()); // Convert enum to String
            authResponse.put("profilePictureFilename", user.getProfilePictureFilename()); // *** ADD THIS LINE ***

            return authResponse; // Return the map
        } else {
            // Throw an exception for invalid credentials
            throw new RuntimeException("Invalid email or password"); 
        }
    }

    // Retrieves a user by their ID.
    @Operation(summary = "Get user by ID", description = "Fetches a user based on the given ID")
    public UserEntity getUserById(int id) {
        return userRepo.findById(id)
        .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Creates a new user.
    @Operation(summary = "Create a new user", description = "Adds a new user to the system")
    public UserEntity saveUser(UserEntity user) {
        return userRepo.save(user);
    }

    // Updates an existing user, potentially including a profile picture.
    @Operation(summary = "Update a user", description = "Updates a user's information based on ID, optionally including a profile picture")
    public UserEntity updateUserFromDTO(int id, UserUpdateDTO dto, MultipartFile profilePictureFile) { // Add MultipartFile parameter
        Optional<UserEntity> optionalUser = userRepo.findById(id);
        if (optionalUser.isPresent()) {
            UserEntity user = optionalUser.get();
            String oldProfilePictureFilename = user.getProfilePictureFilename(); // Get old filename
            String newProfilePictureFilename = null;

            // Handle profile picture upload if provided
            if (profilePictureFile != null && !profilePictureFile.isEmpty()) {
                try {
                    newProfilePictureFilename = fileStorageService.storeFile(profilePictureFile, PROFILE_PICTURE_FOLDER); // Pass folder path
                    logger.info("New profile picture stored with filename: {}", newProfilePictureFilename);
                } catch (Exception e) {
                    logger.error("Failed to store profile picture for user ID: {}", id, e);
                    // Decide how to handle storage failure: throw exception, return null, or continue without picture update?
                    // For now, let's throw a runtime exception to indicate the update failed partially.
                    throw new RuntimeException("Could not store profile picture file.", e);
                }
            }

            // Update user fields from DTO
            user.setFirstName(dto.getFirstName());
            user.setLastName(dto.getLastName());
            user.setEmail(dto.getEmail());
            user.setPhoneNumber(dto.getPhoneNumber());

            // Update password if provided in DTO
            if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(dto.getPassword()));
                logger.info("Password updated for user ID: {}", id);
            }

            // Convert and set Role
            try {
                UserRole roleEnum = UserRole.valueOf(dto.getRole().toUpperCase());
                user.setRole(roleEnum);
            } catch (IllegalArgumentException | NullPointerException e) {
                logger.error("Invalid role provided during update for user ID {}: {}", id, dto.getRole(), e);
                throw new IllegalArgumentException("Invalid role provided: " + dto.getRole(), e);
            }

            // Handle profile picture filename update and old file deletion
            if (newProfilePictureFilename != null) {
                // Delete the old picture *after* successfully storing the new one
                if (oldProfilePictureFilename != null && !oldProfilePictureFilename.isBlank()) {
                    logger.info("Attempting to delete old profile picture: {}", oldProfilePictureFilename);
                    fileStorageService.deleteFile(oldProfilePictureFilename);
                }
                // Set the new filename on the entity
                user.setProfilePictureFilename(newProfilePictureFilename);
            }
            // Note: If newProfilePictureFilename is null, the existing filename remains unchanged.

            // @PreUpdate handles updatedAt automatically
            return userRepo.save(user);
        } else {
            logger.warn("User not found for update with ID: {}", id);
            return null; // Or throw UserNotFoundException
        }
    }

    // Deletes a user by their ID. (Consider deleting profile picture here too)
    @Operation(summary = "Delete a user", description = "Removes a user and their profile picture from the database")
    public String deleteUser(int id) {
        Optional<UserEntity> optionalUser = userRepo.findById(id); // Find user first
        if (optionalUser.isPresent()){
            UserEntity userToDelete = optionalUser.get();
            String profilePictureFilename = userToDelete.getProfilePictureFilename();

            // Attempt to delete the associated profile picture file if it exists
            if (profilePictureFilename != null && !profilePictureFilename.isBlank()) {
                 try {
                     logger.info("Attempting to delete profile picture for user ID {}: {}", id, profilePictureFilename);
                     fileStorageService.deleteFile(profilePictureFilename);
                 } catch (Exception e) {
                    // Log the error but proceed with deleting the DB record
                    logger.error("Error deleting profile picture file '{}' for user ID {}: {}", profilePictureFilename, id, e.getMessage());
                 }
            }

            userRepo.deleteById(id);
            logger.info("User record successfully deleted for ID: {}", id);
            return "User record successfully deleted!";
        } else {
            logger.warn("User not found for deletion with ID: {}", id);
            return id + " NOT FOUND!";
        }
    }

    // Changes the password for a given user ID
    @Operation(summary = "Change user password", description = "Changes the password for a user after verifying the current password")
    public void changePassword(int id, String currentPassword, String newPassword) {
        UserEntity user = userRepo.findById(id)
                .orElseThrow(() -> {
                    logger.warn("User not found for password change with ID: {}", id);
                    return new RuntimeException("User not found");
                });

        // Verify the current password
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            logger.warn("Incorrect current password provided for user ID: {}", id);
            throw new RuntimeException("Incorrect current password");
        }

        // Encode and set the new password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);
        logger.info("Password successfully changed for user ID: {}", id);
    }
}
