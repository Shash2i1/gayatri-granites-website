package com.gayatri_granites.backend.service;

import com.gayatri_granites.backend.config.S3Properties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3StorageService {

    private final S3Client s3Client;
    private final S3Properties s3Properties;

    /**
     * Uploads a file to S3 under the given folder prefix (e.g. "products").
     * Returns both the public URL (for display) and the S3 key (needed for deletion later).
     */
    public UploadResult upload(MultipartFile file, String folderPrefix) {
        String extension = extractExtension(file.getOriginalFilename());
        String key = folderPrefix + "/" + UUID.randomUUID() + extension;

        try {
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(s3Properties.getBucket())
                    .key(key)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(request, RequestBody.fromInputStream(
                    file.getInputStream(), file.getSize()));

            String url = String.format("https://%s.s3.%s.amazonaws.com/%s",
                    s3Properties.getBucket(), s3Properties.getRegion(), key);

            log.info("Uploaded file to S3: [{}]", key);
            return new UploadResult(url, key);

        } catch (IOException e) {
            log.error("Failed to upload file to S3", e);
            throw new RuntimeException("Failed to upload image to S3", e);
        }
    }

    public void delete(String key) {
        if (key == null || key.isBlank()) return;

        s3Client.deleteObject(DeleteObjectRequest.builder()
                .bucket(s3Properties.getBucket())
                .key(key)
                .build());

        log.info("Deleted file from S3: [{}]", key);
    }

    private String extractExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "";
        return filename.substring(filename.lastIndexOf("."));
    }

    public record UploadResult(String url, String key) {}
}