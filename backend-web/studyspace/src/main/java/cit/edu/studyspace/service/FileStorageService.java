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
import org.slf4j.Logger; // Use SLF4J Logger
import org.slf4j.LoggerFactory; // Use SLF4J Logger

@Service
public class FileStorageService {

    private static final Logger logger = LoggerFactory.getLogger(FileStorageService.class); // Add logger

    // Remove fileStorageLocation field and constructor

    /**
     * Stores the given file in the specified target directory.
     * Creates the directory if it doesn't exist.
     *
     * @param file The file to store.
     * @param targetDirectory The directory where the file should be stored.
     * @return The generated unique filename.
     */
    public String storeFile(MultipartFile file, Path targetDirectory) {
        // Normalize file name
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String filename = "";

        try {
            // Ensure the target directory exists
            Files.createDirectories(targetDirectory); // Create directory if needed

            // Check if the file's name contains invalid characters
            if(originalFilename.contains("..")) {
                logger.error("Filename contains invalid path sequence: {}", originalFilename);
                throw new RuntimeException("Sorry! Filename contains invalid path sequence " + originalFilename);
            }

             // Generate a unique file name to avoid collisions
            String fileExtension = "";
            try {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            } catch(Exception e) {
                fileExtension = ""; // Handle files without extensions
                logger.warn("File '{}' has no extension.", originalFilename);
            }
            filename = UUID.randomUUID().toString() + fileExtension;


            // Copy file to the target location (Replacing existing file with the same name)
            Path targetLocation = targetDirectory.resolve(filename); // Use targetDirectory

             try (InputStream inputStream = file.getInputStream()) {
                 Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
                 logger.info("Successfully stored file '{}' at '{}'", filename, targetLocation);
             }

            return filename; // Return the generated unique filename
        } catch (IOException ex) {
            logger.error("Could not store file '{}'. Original filename: '{}'", filename, originalFilename, ex);
            throw new RuntimeException("Could not store file " + (filename.isEmpty() ? originalFilename : filename) + ". Please try again!", ex);
        }
    }

    /**
     * Deletes the file with the given filename from the specified target directory.
     *
     * @param filename The name of the file to delete.
     * @param targetDirectory The directory from which the file should be deleted.
     */
    public void deleteFile(String filename, Path targetDirectory) {
        if (filename == null || filename.isBlank()) {
            logger.warn("Attempted to delete file with null or empty filename in directory: {}", targetDirectory);
            return;
        }

        try {
            Path targetLocation = targetDirectory.resolve(StringUtils.cleanPath(filename)); // Use targetDirectory
            boolean deleted = Files.deleteIfExists(targetLocation);
            if(deleted){
                logger.info("Successfully deleted file: {} from directory: {}", filename, targetDirectory);
            } else {
                 logger.warn("File not found, could not delete: {} from directory: {}", filename, targetDirectory);
            }

        } catch (IOException ex) {
            logger.error("Could not delete file '{}' from directory '{}'", filename, targetDirectory, ex);
           // Optionally re-throw: throw new RuntimeException("Could not delete file " + filename, ex);
        }
    }

    // Optional: Add methods here later to load files if needed
    // public Resource loadFileAsResource(String fileName) { ... }
}
