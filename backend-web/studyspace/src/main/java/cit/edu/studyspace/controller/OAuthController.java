package cit.edu.studyspace.controller;

import cit.edu.studyspace.config.JwtUtil;
import cit.edu.studyspace.entity.UserEntity;
import cit.edu.studyspace.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/oauth")
public class OAuthController {

    @Autowired
    private UserRepo userRepo;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @GetMapping("/user-exists")
    public ResponseEntity<Map<String, Boolean>> checkUserExists(@RequestParam String email) {
        boolean exists = userRepo.existsByEmail(email);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }
}