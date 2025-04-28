package cit.edu.studyspace.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.google.firebase.cloud.StorageClient;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import org.springframework.beans.factory.annotation.Value;

@Service
public class FileStorageService {
    private static final Logger logger = LoggerFactory.getLogger(FileStorageService.class);

    @Value("${firebase.bucket.name:}")
    private String firebaseBucketName;

    /**
     * Stores the given file in Firebase Storage within a specified folder.
     * @param file The file to store.
     * @param folderPath The folder path within the bucket (e.g., "space_images/" or "profile_pictures/").
     * @return The Firebase download URL.
     */
    public String storeFile(MultipartFile file, String folderPath) { // Added folderPath parameter
        try {
            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            String fileExtension = "";
            try {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            } catch(Exception e) {
                fileExtension = "";
            }
            String filename = UUID.randomUUID().toString() + fileExtension;
            String fullPath = folderPath + filename; // Use the provided folder path

            Bucket bucket = firebaseBucketName != null && !firebaseBucketName.isBlank()
                ? StorageClient.getInstance().bucket(firebaseBucketName)
                : StorageClient.getInstance().bucket();

            // Use fullPath when creating the blob
            Blob blob = bucket.create(fullPath, file.getInputStream(), file.getContentType());
            blob.createAcl(com.google.cloud.storage.Acl.of(com.google.cloud.storage.Acl.User.ofAllUsers(), com.google.cloud.storage.Acl.Role.READER));

            // Use fullPath in the download URL
            String downloadUrl = String.format("https://storage.googleapis.com/%s/%s", bucket.getName(), fullPath);
            logger.info("Stored file in Firebase Storage: {}", downloadUrl);
            return downloadUrl;
        } catch (Exception e) {
            logger.error("Failed to upload file to Firebase Storage", e);
            throw new RuntimeException("Could not upload file to Firebase Storage", e);
        }
    }

    /**
     * Deletes the file from Firebase Storage only.
     * The folder path is extracted from the URL.
     * @param downloadUrl The Firebase download URL.
     */
    public void deleteFile(String downloadUrl) {
        try {
            Bucket bucket = firebaseBucketName != null && !firebaseBucketName.isBlank()
                ? StorageClient.getInstance().bucket(firebaseBucketName)
                : StorageClient.getInstance().bucket();

            // Extract the full path (folder + filename) from the URL
            String bucketPart = "/" + bucket.getName() + "/";
            int pathStartIndex = downloadUrl.indexOf(bucketPart);
            if (pathStartIndex == -1) {
                 logger.error("Could not extract bucket name from download URL: {}", downloadUrl);
                 return; // Or throw an exception
            }
            pathStartIndex += bucketPart.length();
            String fullPath = downloadUrl.substring(pathStartIndex);


            // Use fullPath to get and delete the blob
            Blob blob = bucket.get(fullPath);
            if (blob != null) {
                boolean deleted = blob.delete();
                if (deleted) {
                    logger.info("Deleted file from Firebase Storage: {}", fullPath);
                } else {
                    logger.warn("Failed to delete file from Firebase Storage: {}", fullPath);
                }
            } else {
                logger.warn("File not found in Firebase Storage: {}", fullPath);
            }
        } catch (Exception e) {
            logger.error("Failed to delete file from Firebase Storage: {}", downloadUrl, e);
            // Consider re-throwing or handling more gracefully depending on requirements
        }
    }
}
