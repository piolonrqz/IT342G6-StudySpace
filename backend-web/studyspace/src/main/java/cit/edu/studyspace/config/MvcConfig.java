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

    // Inject the upload directory path from application.properties
    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadPath = Paths.get(uploadDir);
        String uploadPathAbsolute = uploadPath.toFile().getAbsolutePath();
        String resourceLocation = "file:///" + uploadPathAbsolute.replace("\\", "/") + "/";
    
        logger.info("Configuring resource handler: Mapping /uploads/** to location: {}", resourceLocation);

        // Simplified: Map only /uploads/** to the physical file system path
        // Requests like http://localhost:8080/uploads/your-image.jpg will be served
        // from C:/studyspace_uploads/images/your-image.jpg
        registry.addResourceHandler("/uploads/**") // Only use /uploads/** here
                .addResourceLocations(resourceLocation); 
    }
}
