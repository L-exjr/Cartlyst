package com.Cartlyst.CartlystAPI.controller;

import com.Cartlyst.CartlystAPI.model.User;
import com.Cartlyst.CartlystAPI.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Only return safe fields
            return ResponseEntity.ok(new UserResponse(user.getId(), user.getFullName(), user.getEmail(), user.getPhoneNumber()));
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }

    static class UserResponse {
        public String id;
        public String fullName;
        public String email;
        public String phoneNumber;
        public UserResponse(String id, String fullName, String email, String phoneNumber) {
            this.id = id;
            this.fullName = fullName;
            this.email = email;
            this.phoneNumber = phoneNumber;
        }
    }
} 