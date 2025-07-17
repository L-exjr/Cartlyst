package com.Cartlyst.CartlystAPI.controller;

import com.Cartlyst.CartlystAPI.model.UploadedFile;
import com.Cartlyst.CartlystAPI.repository.UploadedFileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/files")
public class UploadedFileController {

    public static final String UPLOAD_DIR = "src/main/resources/static/files";

    private final UploadedFileRepository fileRepository;

    @Autowired
    public UploadedFileController(UploadedFileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file,
                                             HttpServletRequest request) {
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = file.getOriginalFilename();
            if (fileName == null || fileName.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid file name.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 🔗 Construct download URL
            String downloadUrl = request.getScheme() + "://" +
                    request.getServerName() + ":" +
                    request.getServerPort() +
                    "/files/view/" + fileName;

            // 💾 Save file record to DB
            UploadedFile uploadedFile = new UploadedFile();
            uploadedFile.setFileName(fileName);
            uploadedFile.setDownloadUrl(downloadUrl);
            fileRepository.save(uploadedFile);

            Map<String, String> success = new HashMap<>();
            success.put("message", "Uploaded! Access here: " + downloadUrl);
            return ResponseEntity.ok(success);

        } catch (IOException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Upload failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
