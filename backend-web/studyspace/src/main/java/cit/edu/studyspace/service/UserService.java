package cit.edu.studyspace.service;

import cit.edu.studyspace.entity.UserEntity;
import cit.edu.studyspace.repository.UserRepo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Tag(name = "User Service", description = "Business logic for user operations")
public class UserService {

    @Autowired
    private UserRepo userRepo;

    // Retrieves all users from the database.
    @Operation(summary = "Get all users", description = "Fetches all users from the database")
    public List<UserEntity> getAllUsers() {
        return userRepo.findAll();
    }

    // Retrieves a user by their ID.

    @Operation(summary = "Get user by ID", description = "Fetches a user based on the given ID")
    public Optional<UserEntity> getUserById(int id) {
        return userRepo.findById(id);
    }

    // Creates a new user.
    @Operation(summary = "Create a new user", description = "Adds a new user to the system")
    public UserEntity createUser(UserEntity user) {
        return userRepo.save(user);
    }

    // Updates an existing user.
    @Operation(summary = "Update a user", description = "Updates a user's information based on ID")
    public UserEntity updateUser(int id, UserEntity updatedUser) {
        return userRepo.findById(id)
                .map(existingUser -> {
                    existingUser.setFirstName(updatedUser.getFirstName());
                    existingUser.setLastName(updatedUser.getLastName());
                    existingUser.setEmail(updatedUser.getEmail());
                    existingUser.setPhoneNumber(updatedUser.getPhoneNumber());
                    existingUser.setRole(updatedUser.getRole());
                    return userRepo.save(existingUser);
                }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Deletes a user by their ID.
    @Operation(summary = "Delete a user", description = "Removes a user from the database")
    public void deleteUser(int id) {
        userRepo.deleteById(id);
    }
}
