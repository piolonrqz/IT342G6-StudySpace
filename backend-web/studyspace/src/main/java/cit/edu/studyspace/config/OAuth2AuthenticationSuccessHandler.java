package cit.edu.studyspace.config;

import cit.edu.studyspace.entity.UserEntity;
import cit.edu.studyspace.entity.UserRole;
import cit.edu.studyspace.repository.UserRepo;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Map;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private UserRepo userRepo;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Value("${frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException, ServletException {
        
        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        OAuth2User oauth2User = oauthToken.getPrincipal();
        
        // Extract user information from Google OAuth2 response
        String email = oauth2User.getAttribute("email");
        String firstName = oauth2User.getAttribute("given_name");
        String lastName = oauth2User.getAttribute("family_name");
        
        // Check if user exists
        UserEntity user = userRepo.findByEmail(email);
        
        // If user doesn't exist, create a new one
        if (user == null) {
            user = new UserEntity();
            user.setEmail(email);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setEmailVerified(true); // Since Google verifies emails
            user.setPassword(""); // OAuth users don't need passwords
            user.setPhoneNumber(""); // Phone number can be updated later
            user.setCreatedAt(LocalDateTime.now());
            user.setRole(UserRole.USER); // Default role
            user = userRepo.save(user);
        }
        
        // Generate JWT token
        String token = jwtUtil.generateToken(user);
        
        // Encode token to prevent any issues with special characters
        String encodedToken = URLEncoder.encode(token, StandardCharsets.UTF_8);
        String role = user.getRole().name(); // Convert enum to string
        
        // Build the redirect URL with proper URL encoding
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromUriString(frontendUrl + "/oauth/callback")
            .queryParam("token", encodedToken)
            .queryParam("role", role)
            .queryParam("userId", user.getId())
            .queryParam("email", URLEncoder.encode(user.getEmail(), StandardCharsets.UTF_8))
            .queryParam("firstName", URLEncoder.encode(user.getFirstName(), StandardCharsets.UTF_8))
            .queryParam("lastName", URLEncoder.encode(user.getLastName(), StandardCharsets.UTF_8));
            
        // Add profilePictureFilename if it exists
        if (user.getProfilePictureFilename() != null && !user.getProfilePictureFilename().isEmpty()) {
            uriBuilder.queryParam("profilePictureFilename", 
                URLEncoder.encode(user.getProfilePictureFilename(), StandardCharsets.UTF_8));
        }
        
        String redirectUrl = uriBuilder.build().toUriString();
        
        // Set CORS headers explicitly for the OAuth callback
        response.setHeader("Access-Control-Allow-Origin", frontendUrl);
        response.setHeader("Access-Control-Allow-Credentials", "true");
        
        // Redirect to frontend with token and user details
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}