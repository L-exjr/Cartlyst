package com.Cartlyst.CartlystAPI.controller;
import com.Cartlyst.CartlystAPI.service.OtpService;
import com.Cartlyst.CartlystAPI.dto.LoginDTO;
import com.Cartlyst.CartlystAPI.dto.OtpDTO;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import com.Cartlyst.CartlystAPI.service.UserService;
import com.Cartlyst.CartlystAPI.model.PendingUser;
import com.Cartlyst.CartlystAPI.repository.PendingUserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.Cartlyst.CartlystAPI.model.PasswordResetToken;
import com.Cartlyst.CartlystAPI.repository.PasswordResetTokenRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.beans.factory.annotation.Value;
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private OtpService otpService;

    @Autowired
private UserService userService; // You go need create this service

@Autowired
private PendingUserRepository pendingUserRepository;
private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

@Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;
    @Autowired
    private JavaMailSender mailSender;
    @Value("${app.frontend.url:http://localhost:8081}")
    private String frontendUrl;

@PostMapping(value = "/signup", consumes = {"application/json"})
public ResponseEntity<Map<String, String>> signup(@RequestBody Map<String, Object> payload) {
    Map<String, String> response = new HashMap<>();
    String email = (String) payload.get("email");
    String phoneNumber = (String) payload.get("phoneNumber");
    String fullName = (String) payload.get("fullName");
    String password = (String) payload.get("password");
    String profileImageUrl = (String) payload.get("profileImageUrl");

    if (userService.emailExists(email) || pendingUserRepository.findByEmail(email).isPresent()) {
        response.put("error", "Email already exists!");
        return ResponseEntity.badRequest().body(response);
    }
    if (userService.phoneExists(phoneNumber) || pendingUserRepository.findByPhoneNumber(phoneNumber).isPresent()) {
        response.put("error", "Phone number already exists!");
        return ResponseEntity.badRequest().body(response);
    }
    // Generate OTP and store in PendingUser
    String verificationCode = String.valueOf((int)(Math.random() * 900000) + 100000);
    PendingUser pendingUser = new PendingUser(fullName, email, phoneNumber, passwordEncoder.encode(password), profileImageUrl, verificationCode);
    pendingUserRepository.save(pendingUser);
    // Send OTP
    otpService.sendOtpToEmail(email);
    response.put("message", "Signup successful! OTP has been sent.");
    response.put("id", String.valueOf(pendingUser.getId()));
    return ResponseEntity.ok(response);
}



    @PostMapping("/login")
public ResponseEntity<Map<String, String>> login(@RequestBody LoginDTO loginDto) {
    boolean validUser = userService.validateLogin(loginDto.getEmail(), loginDto.getPassword());

    Map<String, String> response = new HashMap<>();

    if (validUser) {
        // Fetch the user to get id
        com.Cartlyst.CartlystAPI.model.User user = userService.findByEmailOrPhoneNumber(loginDto.getEmail()).orElse(null);
        response.put("message", "Login successful!");
        response.put("id", user != null ? user.getId() : "");
        return ResponseEntity.ok(response);
    } else {
        response.put("error", "Invalid email/phone or password");
        return ResponseEntity.status(401).body(response);
    }
}


    @PostMapping("/otp")
public ResponseEntity<Map<String, String>> sendOtp(@RequestBody OtpDTO request) {
    String contact = request.getPhoneOrEmail();
    String via = request.getMethod();

    Map<String, String> response = new HashMap<>();

    if (via == null || via.equalsIgnoreCase("email")) {
        otpService.sendOtpToEmail(contact);
        response.put("message", "OTP sent to email successfully!");
        return ResponseEntity.ok(response);
    } else if (via.equalsIgnoreCase("sms")) {
        otpService.sendOtpToSms(contact);
        response.put("message", "OTP sent via SMS successfully!");
        return ResponseEntity.ok(response);
    } else {
        response.put("error", "Invalid OTP delivery method. Use 'email' or 'sms'");
        return ResponseEntity.badRequest().body(response);
    }
}



    @PostMapping("/verify")
public ResponseEntity<Map<String, String>> verifyOtp(@RequestBody OtpDTO otpDto) {
    Map<String, String> response = new HashMap<>();
    // Find pending user by email or phone
    PendingUser pendingUser = pendingUserRepository.findByEmail(otpDto.getPhoneOrEmail())
        .orElseGet(() -> pendingUserRepository.findByPhoneNumber(otpDto.getPhoneOrEmail()).orElse(null));
    if (pendingUser == null) {
        response.put("error", "No pending user found for verification");
        return ResponseEntity.status(400).body(response);
    }
    boolean isValid = otpService.verifyOtp(otpDto.getPhoneOrEmail(), otpDto.getOtp());
    if (isValid) {
        // Move to real users table
        userService.createUserFromPending(pendingUser);
        pendingUserRepository.delete(pendingUser);
        response.put("message", "OTP verified and user created!");
        return ResponseEntity.ok(response);
    } else {
        response.put("error", "Invalid OTP");
        return ResponseEntity.status(400).body(response);
    }
}

    @PostMapping("/request-password-reset")
    public ResponseEntity<?> requestPasswordReset(@RequestBody Map<String, String> body) {
        System.out.println("Received password reset request for: " + body.get("email"));
        String email = body.get("email");
        String resetBaseUrl = body.getOrDefault("resetBaseUrl", frontendUrl); // Allow frontend to specify
        if (email == null || !userService.emailExists(email)) {
            System.err.println("Password reset error: Email not found: " + email);
            return ResponseEntity.badRequest().body(Map.of("error", "Email not found"));
        }
        String token = userService.createPasswordResetToken(email);
        String resetLink = resetBaseUrl + "/reset-password.html?token=" + token;
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Password Reset Request");
        message.setText("Click the following link to reset your password: " + resetLink + "\nThis link will expire in 1 hour.");
        message.setFrom("gimeon2512@gmail.com");
        try {
            mailSender.send(message);
            System.out.println("Password reset email sent successfully to: " + email);
        } catch (Exception e) {
            System.err.println("Failed to send password reset email to " + email + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Failed to send password reset email. Please try again later."));
        }
        return ResponseEntity.ok(Map.of("message", "Password reset link sent"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");
        if (token == null || newPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Token and new password required"));
        }
        boolean valid = userService.resetPassword(token, newPassword);
        if (!valid) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired token"));
        }
        return ResponseEntity.ok(Map.of("message", "Password has been reset successfully"));
    }
}
