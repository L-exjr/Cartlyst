package com.Cartlyst.CartlystAPI.controller;

import com.Cartlyst.CartlystAPI.model.UploadedFile;
import com.Cartlyst.CartlystAPI.repository.UploadedFileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/files")
public class UploadedFileController {

    private final UploadedFileRepository fileRepository;

    @Autowired
    public UploadedFileController(UploadedFileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String fileName = file.getOriginalFilename();
            if (fileName == null || fileName.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid file name.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            // Generate unique filename
            String uniqueFileName = "profile-images/" + java.util.UUID.randomUUID() + "-" + fileName;
            
            System.out.println("Starting upload for file: " + fileName);
            System.out.println("Generated unique filename: " + uniqueFileName);
            
            // Upload to Supabase using the service key
            String supabaseUrl = "https://bfczicwbwhqfnbdcyfli.supabase.co";
            String bucket = "cartlyst";
            String serviceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmY3ppY3did2hxZm5iZGN5ZmxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjg3NTU3NSwiZXhwIjoyMDY4NDUxNTc1fQ.XavwGlFICZ49w21mbXa6r0--xYW680ORAI-bh-Cu084";

            // Upload to Supabase Storage
            String downloadUrl = uploadToSupabase(file, uniqueFileName, supabaseUrl, bucket, serviceKey);
            
            if (downloadUrl == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Failed to upload to Supabase.");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
            }

            System.out.println("Upload successful, download URL: " + downloadUrl);

            // 💾 Save file record to DB
            UploadedFile uploadedFile = new UploadedFile();
            uploadedFile.setFileName(fileName);
            uploadedFile.setDownloadUrl(downloadUrl);
            fileRepository.save(uploadedFile);

            Map<String, String> success = new HashMap<>();
            success.put("message", "Uploaded successfully!");
            success.put("downloadUrl", downloadUrl);
            return ResponseEntity.ok(success);

        } catch (Exception e) {
            System.out.println("Upload failed with exception: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Upload failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/upload-local")
    public ResponseEntity<?> uploadFileLocal(@RequestParam("file") MultipartFile file,
                                           HttpServletRequest request) {
        try {
            String fileName = file.getOriginalFilename();
            if (fileName == null || fileName.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid file name.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            // Generate unique filename
            String uniqueFileName = "profile-" + java.util.UUID.randomUUID() + "-" + fileName;
            
            // Create upload directory
            String uploadDir = "uploads/profile-images/";
            java.nio.file.Path uploadPath = java.nio.file.Paths.get(uploadDir);
            if (!java.nio.file.Files.exists(uploadPath)) {
                java.nio.file.Files.createDirectories(uploadPath);
            }

            // Save file locally
            java.nio.file.Path filePath = uploadPath.resolve(uniqueFileName);
            java.nio.file.Files.copy(file.getInputStream(), filePath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            // Construct download URL
            String downloadUrl = request.getScheme() + "://" +
                    request.getServerName() + ":" +
                    request.getServerPort() +
                    "/files/image/" + uniqueFileName;

            System.out.println("Local upload successful, download URL: " + downloadUrl);

            // 💾 Save file record to DB
            UploadedFile uploadedFile = new UploadedFile();
            uploadedFile.setFileName(fileName);
            uploadedFile.setDownloadUrl(downloadUrl);
            fileRepository.save(uploadedFile);

            Map<String, String> success = new HashMap<>();
            success.put("message", "Uploaded successfully!");
            success.put("downloadUrl", downloadUrl);
            return ResponseEntity.ok(success);

        } catch (Exception e) {
            System.out.println("Local upload failed with exception: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Upload failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/test-supabase")
    public ResponseEntity<?> testSupabaseConnection() {
        try {
            String supabaseUrl = "https://bfczicwbwhqfnbdcyfli.supabase.co";
            String bucket = "cartlyst";
            String serviceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmY3ppY3did2hxZm5iZGN5ZmxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjg3NTU3NSwiZXhwIjoyMDY4NDUxNTc1fQ.XavwGlFICZ49w21mbXa6r0--xYW680ORAI-bh-Cu084";

            // Test Supabase connection by listing buckets
            java.net.URL url = new java.net.URL(supabaseUrl + "/storage/v1/bucket/list");
            java.net.HttpURLConnection conn = (java.net.HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Authorization", "Bearer " + serviceKey);
            conn.setRequestProperty("Content-Type", "application/json");

            int responseCode = conn.getResponseCode();
            System.out.println("Supabase connection test response code: " + responseCode);

            Map<String, Object> result = new HashMap<>();
            result.put("responseCode", responseCode);
            result.put("message", responseCode == 200 ? "Supabase connection successful" : "Supabase connection failed");

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Supabase connection test failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/image/{filename}")
    public ResponseEntity<?> serveImage(@PathVariable String filename) {
        try {
            String uploadDir = "uploads/profile-images/";
            java.nio.file.Path filePath = java.nio.file.Paths.get(uploadDir, filename);
            
            if (!java.nio.file.Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            byte[] imageBytes = java.nio.file.Files.readAllBytes(filePath);
            return ResponseEntity.ok()
                    .contentType(org.springframework.http.MediaType.IMAGE_JPEG)
                    .body(imageBytes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private String uploadToSupabase(MultipartFile file, String fileName, String supabaseUrl, String bucket, String serviceKey) {
        try {
            // Use the correct Supabase Storage API endpoint
            java.net.URL url = new java.net.URL(supabaseUrl + "/storage/v1/object/" + bucket + "/" + fileName);
            java.net.HttpURLConnection conn = (java.net.HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Authorization", "Bearer " + serviceKey);
            conn.setRequestProperty("Content-Type", file.getContentType());
            conn.setDoOutput(true);

            try (java.io.OutputStream os = conn.getOutputStream()) {
                os.write(file.getBytes());
            }

            int responseCode = conn.getResponseCode();
            System.out.println("Supabase upload response code: " + responseCode);
            
            if (responseCode == 200 || responseCode == 201) {
                // Try different URL formats for public access
                String publicUrl1 = supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + fileName;
                String publicUrl2 = supabaseUrl + "/storage/v1/object/" + bucket + "/" + fileName;
                
                System.out.println("Generated public URL 1: " + publicUrl1);
                System.out.println("Generated public URL 2: " + publicUrl2);
                
                // Return the first format (most common for public access)
                return publicUrl1;
            } else {
                // Read error response
                try (java.io.BufferedReader br = new java.io.BufferedReader(
                        new java.io.InputStreamReader(conn.getErrorStream()))) {
                    StringBuilder response = new StringBuilder();
                    String line;
                    while ((line = br.readLine()) != null) {
                        response.append(line);
                    }
                    System.out.println("Supabase error response: " + response.toString());
                }
                return null;
            }
        } catch (Exception e) {
            System.out.println("Supabase upload error: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
}
