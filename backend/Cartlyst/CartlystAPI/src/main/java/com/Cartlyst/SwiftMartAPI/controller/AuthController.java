package com.Cartlyst.CartlystAPI.controller;
import com.Cartlyst.CartlystAPI.dto.UserDTO;
import com.Cartlyst.CartlystAPI.service.OtpService;
import com.Cartlyst.CartlystAPI.dto.LoginDTO;
import com.Cartlyst.CartlystAPI.dto.OtpDTO;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import com.Cartlyst.CartlystAPI.service.UserService;
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private OtpService otpService;

    @Autowired
private UserService userService; // You go need create this service

@PostMapping("/signup")
public ResponseEntity<Map<String, String>> signup(@RequestBody UserDTO userDto) {
    Map<String, String> response = new HashMap<>();
    if (userService.emailExists(userDto.getEmail())) {
        response.put("error", "Email already exists!");
        return ResponseEntity.badRequest().body(response);
    }
    if (userService.phoneExists(userDto.getPhoneNumber())) {
        response.put("error", "Phone number already exists!");
        return ResponseEntity.badRequest().body(response);
    }

    userService.createUser(userDto); // Save user

    // Fetch the user to get id
    com.Cartlyst.CartlystAPI.model.User user = userService.findByEmail(userDto.getEmail().trim().toLowerCase());
    response.put("message", "Signup successful! OTP has been sent.");
    response.put("id", user != null ? user.getId() : "");
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
    boolean isValid = otpService.verifyOtp(otpDto.getPhoneOrEmail(), otpDto.getOtp());
    Map<String, String> response = new HashMap<>();
    
    if (isValid) {
        response.put("message", "OTP verified!");
        return ResponseEntity.ok(response);
    } else {
        response.put("error", "Invalid OTP");
        return ResponseEntity.status(400).body(response);
    }
}
}
