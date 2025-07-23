package com.Cartlyst.CartlystAPI.controller;

import com.Cartlyst.CartlystAPI.model.User;
import com.Cartlyst.CartlystAPI.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import org.springframework.http.MediaType;
import java.net.HttpURLConnection;
import java.net.URL;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @PutMapping("/{id}/profile-image")
    public ResponseEntity<?> updateProfileImage(@PathVariable String id, @RequestBody Map<String, String> body) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String oldImageUrl = user.getProfileImageUrl();
            String newImageUrl = body.get("profileImageUrl");
            // If the old image exists and is different from the new one, delete it from Supabase
            if (oldImageUrl != null && !oldImageUrl.equals(newImageUrl) && oldImageUrl.contains("supabase.co")) {
                try {
                    String[] parts = oldImageUrl.split("/object/public/cartlyst/");
                    if (parts.length == 2) {
                        String objectPath = parts[1];
                        String deleteUrl = "https://bfczicwbwhqfnbdcyfli.supabase.co/storage/v1/object/cartlyst/" + objectPath;
                        System.out.println("[Update Profile Image] Deleting old image: " + deleteUrl);
                        URL url = new URL(deleteUrl);
                        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                        conn.setRequestMethod("DELETE");
                        conn.setRequestProperty("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmY3ppY3did2hxZm5iZGN5ZmxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjg3NTU3NSwiZXhwIjoyMDY4NDUxNTc1fQ.XavwGlFICZ49w21mbXa6r0--xYW680ORAI-bh-Cu084");
                        int responseCode = conn.getResponseCode();
                        System.out.println("[Update Profile Image] Supabase delete response code: " + responseCode);
                    } else {
                        System.err.println("[Update Profile Image] Supabase image URL format invalid: " + oldImageUrl);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                    System.err.println("[Update Profile Image] Failed to delete old image from Supabase: " + e.getMessage());
                }
            }
            user.setProfileImageUrl(newImageUrl);
            userRepository.save(user);
            // Return the updated user object
            return ResponseEntity.ok(new UserResponse(user.getId(), user.getFullName(), user.getEmail(), user.getPhoneNumber(), user.getProfileImageUrl()));
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Only return safe fields
            return ResponseEntity.ok(new UserResponse(user.getId(), user.getFullName(), user.getEmail(), user.getPhoneNumber(), user.getProfileImageUrl()));
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }

    @GetMapping("/{id}/profile-image-proxy")
    public ResponseEntity<byte[]> getProfileImageProxy(@PathVariable String id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty() || userOpt.get().getProfileImageUrl() == null) {
            return ResponseEntity.notFound().build();
        }
        String imageUrl = userOpt.get().getProfileImageUrl();

        try {
            // Use Java's HttpURLConnection to fetch the image with the Supabase service key
            java.net.URL url = new java.net.URL(imageUrl);
            java.net.HttpURLConnection conn = (java.net.HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmY3ppY3did2hxZm5iZGN5ZmxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjg3NTU3NSwiZXhwIjoyMDY4NDUxNTc1fQ.XavwGlFICZ49w21mbXa6r0--xYW680ORAI-bh-Cu084");
            conn.setRequestProperty("Accept", "image/*");

            int responseCode = conn.getResponseCode();
            if (responseCode != 200) {
                return ResponseEntity.status(responseCode).build();
            }

            try (java.io.InputStream is = conn.getInputStream()) {
                byte[] imageBytes = is.readAllBytes();
                return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(imageBytes);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/{id}/profile-image")
    public ResponseEntity<?> deleteProfileImage(@PathVariable String id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            System.err.println("[Delete Profile Image] User not found: " + id);
            return ResponseEntity.status(404).body("User not found");
        }
        User user = userOpt.get();
        String imageUrl = user.getProfileImageUrl();
        System.out.println("[Delete Profile Image] User: " + id + ", imageUrl: " + imageUrl);
        if (imageUrl != null && imageUrl.contains("supabase.co")) {
            try {
                // Extract the path after /object/ for Supabase delete
                String[] parts = imageUrl.split("/object/public/cartlyst/");
if (parts.length == 2) {
    String objectPath = parts[1]; // This will be just "profile-images/..."
    String deleteUrl = "https://bfczicwbwhqfnbdcyfli.supabase.co/storage/v1/object/cartlyst/" + objectPath;
                    System.out.println("[Delete Profile Image] Supabase delete URL: " + deleteUrl);
                    URL url = new URL(deleteUrl);
                    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                    conn.setRequestMethod("DELETE");
                    conn.setRequestProperty("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmY3ppY3did2hxZm5iZGN5ZmxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjg3NTU3NSwiZXhwIjoyMDY4NDUxNTc1fQ.XavwGlFICZ49w21mbXa6r0--xYW680ORAI-bh-Cu084");
                    int responseCode = conn.getResponseCode();
                    System.out.println("[Delete Profile Image] Supabase response code: " + responseCode);
                    if (responseCode != 200 && responseCode != 204) {
                        String errorMsg = "Failed to delete image from Supabase. Code: " + responseCode;
                        System.err.println("[Delete Profile Image] " + errorMsg);
                        return ResponseEntity.status(500).body(errorMsg);
                    }
                } else {
                    String errorMsg = "Supabase image URL format invalid: " + imageUrl;
                    System.err.println("[Delete Profile Image] " + errorMsg);
                    return ResponseEntity.status(400).body(errorMsg);
                }
            } catch (Exception e) {
                e.printStackTrace();
                String errorMsg = "Failed to delete image from Supabase: " + e.getMessage();
                System.err.println("[Delete Profile Image] " + errorMsg);
                return ResponseEntity.status(500).body(errorMsg);
            }
        }
        user.setProfileImageUrl(null);
        userRepository.save(user);
        System.out.println("[Delete Profile Image] Profile image deleted for user: " + id);
        return ResponseEntity.ok("Profile image deleted");
    }

    static class UserResponse {
        public String id;
        public String fullName;
        public String email;
        public String phoneNumber;
        public String profileImageUrl;
        public UserResponse(String id, String fullName, String email, String phoneNumber, String profileImageUrl) {
            this.id = id;
            this.fullName = fullName;
            this.email = email;
            this.phoneNumber = phoneNumber;
            this.profileImageUrl = profileImageUrl;
        }
    }
} 