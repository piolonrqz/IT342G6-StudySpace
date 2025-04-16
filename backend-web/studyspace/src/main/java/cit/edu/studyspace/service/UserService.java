package cit.edu.studyspace.service;

import cit.edu.studyspace.config.JwtUtil;
import cit.edu.studyspace.dto.UserUpdateDTO;
import cit.edu.studyspace.entity.UserEntity;
import cit.edu.studyspace.entity.UserRole;
import cit.edu.studyspace.repository.UserRepo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Tag(name = "User Service", description = "Business logic for user operations")
public class UserService {

    @Autowired
    private UserRepo userRepo;
    @Autowired
    private JwtUtil jwtUtil;

    public UserService(){
        super();
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
        if (user != null && user.getPassword().equals(password)) { 
            // User authenticated successfully
            String token = jwtUtil.generateToken(user); // Generate JWT token

            // Create a map to hold the response data
            Map<String, Object> authResponse = new HashMap<>();
            authResponse.put("token", token);
            authResponse.put("id", user.getId());
            authResponse.put("firstName", user.getFirstName());
            authResponse.put("lastName", user.getLastName());
            authResponse.put("role", user.getRole().name()); // Convert enum to String

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

    // Updates an existing user.
    @Operation(summary = "Update a user", description = "Updates a user's information based on ID")
    public UserEntity updateUserFromDTO(int id, UserUpdateDTO dto) {
        Optional<UserEntity> optionalUser = userRepo.findById(id);
        if (optionalUser.isPresent()) {
            UserEntity user = optionalUser.get();

            user.setFirstName(dto.getFirstName());
            user.setLastName(dto.getLastName());
            user.setEmail(dto.getEmail());
            user.setPhoneNumber(dto.getPhoneNumber());

            // Convert the String from DTO to UserRole enum
            try {
                UserRole roleEnum = UserRole.valueOf(dto.getRole().toUpperCase()); // Convert String to Enum (case-insensitive)
                user.setRole(roleEnum); // Set the enum value
            } catch (IllegalArgumentException | NullPointerException e) {
                // Handle cases where the role string is invalid or null
                // Option 1: Throw an exception back to the controller
                throw new IllegalArgumentException("Invalid role provided: " + dto.getRole(), e);
                // Option 2: Log an error and potentially skip setting the role or set a default? (Depends on requirements)
                // System.err.println("Invalid role provided: " + dto.getRole());
            }

            return userRepo.save(user);
        }
        return null;
    }

    // Deletes a user by their ID.
    @Operation(summary = "Delete a user", description = "Removes a user from the database")
    public String deleteUser(int id) {
        String msg = " ";
        if (userRepo.findById(id)!=null){
            userRepo.deleteById(id);
            msg = "User record successfully deleted!";
        }else
            msg = id + "NOT FOUND!";
        return msg;
    }
}
