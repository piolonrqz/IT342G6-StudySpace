package cit.edu.studyspace.controller;

import cit.edu.studyspace.entity.UserEntity;
import cit.edu.studyspace.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User API", description = "Operations related to users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/getAll")
    @Operation(summary = "Get all users", description = "Fetches all users in the system")
    public List<UserEntity> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/save")
    @Operation(summary = "Create a new user", description = "Adds a new user to the system")
    public UserEntity createUser(@RequestBody UserEntity user) {
        return userService.createUser(user);
    }
}
