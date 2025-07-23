package com.Cartlyst.CartlystAPI.util;

import org.springframework.web.multipart.MultipartFile;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.UUID;

public class SupabaseStorageUtil {
    public static String uploadToSupabase(MultipartFile file) {
        try {
            String supabaseUrl = "https://bfczicwbwhqfnbdcyfli.supabase.co";
            String bucket = "cartlyst";
            String serviceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmY3ppY3did2hxZm5iZGN5ZmxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjg3NTU3NSwiZXhwIjoyMDY4NDUxNTc1fQ.XavwGlFICZ49w21mbXa6r0--xYW680ORAI-bh-Cu084";

            String fileName = "profile-images/" + UUID.randomUUID() + "-" + file.getOriginalFilename();
            URL url = new URL(supabaseUrl + "/storage/v1/object/" + bucket + "/" + fileName);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Authorization", "Bearer " + serviceKey);
            conn.setRequestProperty("Content-Type", file.getContentType());
            conn.setDoOutput(true);

            try (OutputStream os = conn.getOutputStream()) {
                os.write(file.getBytes());
            }

            int responseCode = conn.getResponseCode();
            if (responseCode == 200 || responseCode == 201) {
                // Construct public URL
                return supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + fileName;
            } else {
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
} 