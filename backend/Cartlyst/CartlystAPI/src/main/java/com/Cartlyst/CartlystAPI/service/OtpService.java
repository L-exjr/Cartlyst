package com.Cartlyst.CartlystAPI.service;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;


@Service
public class OtpService {

    private final Map<String, String> otpStorage = new HashMap<>();

    @Autowired
    private JavaMailSender mailSender;
    @Autowired
private RestTemplate restTemplate;

    /**
     * Sends an OTP to email only.
     */
    public void sendOtpToEmail(String email) {
    String otp = generateOtp();
    otpStorage.put(email, otp);

    System.out.println("Generated Email OTP for " + email + ": " + otp);

    try {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Your Cartlyst OTP Code");
        message.setText("Your OTP is: " + otp + "\n\nIt will expire in 5 minutes.");
        message.setFrom("Cartlyst <gimeon2512@gmail.com>");

        mailSender.send(message);

        System.out.println("OTP Email sent successfully to: " + email);
    } catch (Exception e) {
        System.out.println("Failed to send email OTP to " + email + ": " + e.getMessage());
    }
}


    /**
     * Sends an OTP to phone number via SMS — IMPLEMENT LATER
     */
 public void sendOtpToSms(String phoneNumber) {
        String otp = generateOtp();
        otpStorage.put(phoneNumber, otp);

        System.out.println("Generated SMS OTP for " + phoneNumber + ": " + otp);

        // USMSGH correct API endpoint for OTP SMS
        String url = "https://webapp.usmsgh.com/api/sms/send";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer 2243|nhWCUJGVC3WncWLqR3lko35vnsrg5OUluK7F1xBee9e9990c"); // No trailing space
        headers.set("Accept", "application/json");
        headers.set("User-Agent", "PostmanRuntime/7.32.2");

        // USMSGH expects recipient as a string (no plus sign), type as 'plain'
        String formattedPhone = phoneNumber.startsWith("+") ? phoneNumber.substring(1) : phoneNumber;

        Map<String, Object> payload = new HashMap<>();
        payload.put("recipient", formattedPhone); // string, no plus sign
        payload.put("sender_id", "Cartlyst");
        payload.put("type", "plain");
        payload.put("message", "Your OTP is: " + otp + "\nIt will expire in 5 minutes.");

        // Serialize payload to JSON string
        String jsonPayload = null;
        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            jsonPayload = mapper.writeValueAsString(payload);
            System.out.println("USMSGH Payload: " + jsonPayload);
        } catch (Exception e) {
            System.out.println("Failed to serialize payload: " + e.getMessage());
            return;
        }

        HttpEntity<String> request = new HttpEntity<>(jsonPayload, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            System.out.println("USMSGH Response: " + response.getBody());
        } catch (Exception e) {
            System.out.println("Failed to send OTP SMS via USMSGH: " + e.getMessage());
        }
    }

    public boolean verifyOtp(String phoneOrEmail, String otp) {
        String storedOtp = otpStorage.get(phoneOrEmail);
        boolean match = otp != null && otp.equals(storedOtp);

        System.out.println("Verifying OTP for " + phoneOrEmail + ": " + otp + " == " + storedOtp + " → " + match);
        return match;
    }

    private String generateOtp() {
        return String.valueOf(new Random().nextInt(900000) + 100000);
    }
}