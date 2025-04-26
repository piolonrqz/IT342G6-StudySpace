package cit.edu.studyspace;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.beans.factory.annotation.Value;
import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.InputStream;

@SpringBootApplication
@EnableScheduling // Enable scheduling for the entire application
public class StudyspaceApplication {

    @Value("${firebase.service.account.path}")
    private String firebaseServiceAccountPath;

    @PostConstruct
    public void initFirebase() {
        try {
            InputStream serviceAccount = getClass().getClassLoader().getResourceAsStream(
                firebaseServiceAccountPath.replace("classpath:", "")
            );
            FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();
            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize Firebase", e);
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(StudyspaceApplication.class, args);
    }
}
