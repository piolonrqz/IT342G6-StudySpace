package cit.edu.studyspace.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class MvcConfig implements WebMvcConfigurer {
    private static final Logger logger = LoggerFactory.getLogger(MvcConfig.class);
    
    // Remove file storage configuration since we're using Firebase Storage
}
