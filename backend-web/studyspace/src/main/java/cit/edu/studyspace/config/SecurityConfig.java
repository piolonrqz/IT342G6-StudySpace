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
            .cors(withDefaults())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.POST, "/api/space/save").permitAll()
                .requestMatchers(
                    "/swagger-ui/**", 
                    "/api-docs/**", 
                    "/swagger-resources/**",
                    "/swagger-ui.html",
                    "/webjars/**",
                    "/api/users/**",
                    "/api/space/**",
                    "/api/booking/**",
                    "/api/oauth/**",
                    "/login/**",
                    "/uploads/**",
                    "/images/**",
                    "/files/**",
                    "/oauth2/"
                ).permitAll()
                .anyRequest().authenticated() )// Other endpoints require JWT
                .oauth2Login(oauth2 -> oauth2
                .successHandler(oauth2login) 
                .userInfoEndpoint(userInfo -> userInfo.oidcUserService(oidcUserService()))
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
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
        configuration.setAllowedOrigins(List.of("http://localhost:8080", "http://localhost:5173")); // Specify allowed origins
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Allowed HTTP methods
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        // Register CORS for all paths
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // For all paths

        return new CorsFilter(source);
    }
}

// For Testing ONLY (disabled authentication)
/*
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())  // Disable CSRF for testing
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll()); // Allow all requests

        return http.build();
    }
 */