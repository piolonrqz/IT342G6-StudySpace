package cit.edu.studyspace;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling // Enable scheduling for the entire application
public class StudyspaceApplication {
	public static void main(String[] args) {
		SpringApplication.run(StudyspaceApplication.class, args);
	}
}
