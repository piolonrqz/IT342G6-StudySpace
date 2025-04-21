package cit.edu.studyspace.controller;

import cit.edu.studyspace.config.JwtUtil;
import cit.edu.studyspace.entity.UserEntity;
import cit.edu.studyspace.repository.UserRepo;
import io.swagger.v3.oas.annotations.Operation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class OAuthController {

    @Autowired
    private UserRepo userRepo;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;
    
    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String googleClientSecret;
    
    @Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
    private String redirectUri;
    
    @GetMapping("/google")
    @Operation(summary = "Initiate Google OAuth", description = "Redirects to Google's OAuth page")
    public void initiateGoogleOAuth(HttpServletResponse response) throws IOException {
        // Use absolute URL instead of relative URL to prevent any path resolution issues
        response.sendRedirect("http://localhost:8080/oauth2/authorization/google");
    }
    
    @GetMapping("/user-exists")
    @Operation(summary = "Check User Exists", description = "Check if user already exists")
    public ResponseEntity<Map<String, Boolean>> checkUserExists(@RequestParam String email) {
        boolean exists = userRepo.existsByEmail(email);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }
}