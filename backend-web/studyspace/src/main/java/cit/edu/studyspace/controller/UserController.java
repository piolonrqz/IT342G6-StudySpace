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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User API", description = "Operations related to users")
public class UserController {

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

    // Login - Generate JWT Token
    @PostMapping("/login")
    @Operation(summary = "User authentication", description = "Authenticates user and returns JWT token")
    public ResponseEntity<?> login(@RequestBody Map<String, String> userData) {
        String email = userData.get("email");
        String password = userData.get("password");
    
        String token = userService.authenticateUser(email, password);
    
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
    
        return ResponseEntity.ok(response);
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
    public List<UserEntity> getAllUsers() {
        return userService.getAllUsers();
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


    @PutMapping("/update/{id}")
    public ResponseEntity<UserEntity> updateUser(@PathVariable int id, @RequestBody UserEntity updatedUser) {
        try {
            UserEntity existingUser = userService.getUserById(id);
            existingUser.setFirstName(updatedUser.getFirstName());
            existingUser.setLastName(updatedUser.getLastName());
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setPhoneNumber(updatedUser.getPhoneNumber());
            existingUser.setRole(updatedUser.getRole());
            
            if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                existingUser.setPassword(updatedUser.getPassword());
            }
            
            UserEntity savedUser = userService.saveUser(existingUser);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public String deleteUser(@PathVariable int id){
        return userService.deleteUser(id);
    }
}
