package cit.edu.studyspace.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.http.HttpMethod;
import java.util.List;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.http.HttpStatus;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.springframework.security.config.Customizer.withDefaults;
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtRequestFilter jwtRequestFilter;
    private final OAuth2AuthenticationSuccessHandler oauth2login;

    public SecurityConfig(JwtRequestFilter jwtRequestFilter, OAuth2AuthenticationSuccessHandler oauth2login) {
        this.jwtRequestFilter = jwtRequestFilter;
        this.oauth2login = oauth2login;
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(withDefaults()) // Keep your existing CORS config
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.POST, "/api/space/save").permitAll() // Example specific permit
                .requestMatchers( // Publicly accessible paths
                    "/swagger-ui/**",
                    "/api-docs/**",
                    "/swagger-resources/**",
                    "/swagger-ui.html",
                    "/webjars/**",
                    "/api/users/register", // Be specific about public user endpoints
                    "/api/users/login",    // Be specific about public user endpoints
                    "/api/space/**",          // Allow fetching all spaces
                    "/api/space/{id}",     // Allow fetching specific space details
                    "/api/users/**",
                    "/uploads/**",
                    "/images/**",
                    "/files/**",
                    "/oauth2/**",          // OAuth endpoints
                    "/login/**"            // OAuth endpoints
                    // Add any other specific public endpoints here
                ).permitAll()
                .requestMatchers("/api/**").authenticated() // Secure all other API endpoints
                .anyRequest().permitAll() // Allow access to frontend routes, etc. (adjust if needed)
            )
            .oauth2Login(oauth2 -> oauth2
                .successHandler(oauth2login)
                .userInfoEndpoint(userInfo -> userInfo.oidcUserService(oidcUserService()))
                // Optional: Configure login page if needed for non-API access
                // .loginPage("/login") // Example: if you have a dedicated login page route
            )
            .exceptionHandling(exceptions -> exceptions
                // For API requests (/api/**), return 401 Unauthorized on authentication failure
                .defaultAuthenticationEntryPointFor(
                    new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
                    new AntPathRequestMatcher("/api/**")
                )
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)); // Ensure stateless

            http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public OidcUserService oidcUserService() {
        return new OidcUserService();
    }


    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Keep your allowed origins, methods, headers etc.
        configuration.setAllowedOrigins(List.of("http://localhost:5173")); // Only frontend needed usually
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Apply CORS globally

        return new CorsFilter(source);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}