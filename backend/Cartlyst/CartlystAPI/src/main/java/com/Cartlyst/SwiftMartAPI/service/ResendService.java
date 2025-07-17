package com.Cartlyst.CartlystAPI.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

@Service
public class ResendService {

    private final String apiKey = "re_SF5tAt4n_PJEK7JTNToB6yZkP5jUtKm9P";

    public void sendEmail(String to, String subject, String html) {
        try {
            URL url = new URL("https://api.resend.com/emails");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Authorization", "Bearer " + apiKey);
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);

            Map<String, Object> body = new HashMap<>();
            body.put("from", "Cartlyst <onboarding@resend.dev>");
            body.put("to", to);
            body.put("subject", subject);
            body.put("html", html);

            ObjectMapper mapper = new ObjectMapper();
            String jsonBody = mapper.writeValueAsString(body);

            OutputStream os = conn.getOutputStream();
            os.write(jsonBody.getBytes());
            os.flush();
            os.close();

            int responseCode = conn.getResponseCode();
            if (responseCode == 200 || responseCode == 202) {
                System.out.println("✅ Email sent via Resend to: " + to);
            } else {
                System.out.println("❌ Failed. HTTP Code: " + responseCode);
            }

            conn.disconnect();
        } catch (Exception e) {
            System.out.println("❌ Exception: " + e.getMessage());
        }
    }
}
