package cit.edu.studyspace.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils; // Import StringUtils
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    // Inject the property from application.properties
    public FileStorageService(@Value("${file.upload-dir}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public String storeFile(MultipartFile file) {
        // Normalize file name
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String filename = "";

        try {
            // Check if the file's name contains invalid characters
            if(originalFilename.contains("..")) {
                throw new RuntimeException("Sorry! Filename contains invalid path sequence " + originalFilename);
            }

             // Generate a unique file name to avoid collisions
            String fileExtension = "";
            try {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            } catch(Exception e) {
                fileExtension = ""; // Handle files without extensions
            }
            filename = UUID.randomUUID().toString() + fileExtension;


            // Copy file to the target location (Replacing existing file with the same name)
            Path targetLocation = this.fileStorageLocation.resolve(filename);
            
             try (InputStream inputStream = file.getInputStream()) {
                 Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
             }

            return filename; // Return the generated unique filename
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + filename + ". Please try again!", ex);
        }
    }

    /**
     * Deletes the file with the given filename from the storage directory.
     *
     * @param filename The name of the file to delete.
     */
    public void deleteFile(String filename) {
        if (filename == null || filename.isBlank()) {
            System.out.println("Filename is null or empty, cannot delete."); // Or log this
            return;
        }

        try {
            Path targetLocation = this.fileStorageLocation.resolve(StringUtils.cleanPath(filename));
            boolean deleted = Files.deleteIfExists(targetLocation);
            if(deleted){
                System.out.println("Successfully deleted file: " + filename); // Or use a logger
            } else {
                 System.out.println("File not found, could not delete: " + filename); // Or use a logger
            }

        } catch (IOException ex) {
            // Log the exception, but maybe don't stop the whole process
            // Depending on requirements, you might re-throw a custom exception
            System.err.println("Could not delete file " + filename + ". Error: " + ex.getMessage());
           // Optionally re-throw: throw new RuntimeException("Could not delete file " + filename, ex);
        }
    }


    // Optional: Add methods here later to load files if needed
    // public Resource loadFileAsResource(String fileName) { ... }
}
