package cit.edu.studyspace.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// Import logging classes
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class MvcConfig implements WebMvcConfigurer {

    // Add a logger instance
    private static final Logger logger = LoggerFactory.getLogger(MvcConfig.class);

    // Inject the space image upload directory path
    @Value("${file.upload-dir}")
    private String spaceUploadDir;

    // Inject the profile picture upload directory path
    @Value("${file.upload-dir.profile-pictures}")
    private String profilePictureUploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Configure resource handler for Space Images
        configureResourceHandler(registry, "/uploads/**", spaceUploadDir);

        // Configure resource handler for Profile Pictures
        configureResourceHandler(registry, "/profile-pictures/**", profilePictureUploadDir);
    }

    private void configureResourceHandler(ResourceHandlerRegistry registry, String urlPath, String directoryPath) {
        Path uploadPath = Paths.get(directoryPath);
        String uploadPathAbsolute = uploadPath.toFile().getAbsolutePath();
        // Ensure consistent slashes and trailing slash for directory mapping
        String resourceLocation = "file:///" + uploadPathAbsolute.replace("\\", "/") + "/";

        logger.info("Configuring resource handler: Mapping {} to location: {}", urlPath, resourceLocation);

        registry.addResourceHandler(urlPath)
                .addResourceLocations(resourceLocation);
    }
}
