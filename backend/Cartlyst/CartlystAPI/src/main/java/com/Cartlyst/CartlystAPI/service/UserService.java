package com.Cartlyst.CartlystAPI.service;

import com.Cartlyst.CartlystAPI.model.User;
import com.Cartlyst.CartlystAPI.repository.UserRepository;
import com.Cartlyst.CartlystAPI.dto.UserDTO;
//import java.time.LocalDateTime;
import com.Cartlyst.CartlystAPI.model.PendingUser;
import com.Cartlyst.CartlystAPI.model.PasswordResetToken;
import com.Cartlyst.CartlystAPI.repository.PasswordResetTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.Optional;
import java.util.Date;
import java.util.UUID;
import org.springframework.transaction.annotation.Transactional;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();


    public boolean emailExists(String email) {
    if (email == null) return false;
    return userRepository.existsByEmail(email.trim().toLowerCase());
}

public boolean phoneExists(String phone) {
    if (phone == null) return false;
    return userRepository.existsByPhoneNumber(phone.trim().replaceAll("\\s+", ""));
}

public void createUser(UserDTO dto) {
    // Generate next string ID
    String nextId = "CL00000001";
    Optional<User> maxUserOpt = userRepository.findUserWithMaxId();
    if (maxUserOpt.isPresent()) {
        String maxId = maxUserOpt.get().getId();
        if (maxId != null && maxId.startsWith("CL")) {
            int num = Integer.parseInt(maxId.substring(2));
            nextId = String.format("CL%08d", num + 1);
        }
    }
    User user = new User();
    user.setId(nextId);
    user.setEmail(dto.getEmail().trim().toLowerCase());
    user.setPhoneNumber(dto.getPhoneNumber().trim().replaceAll("\\s+", ""));
    user.setPassword(passwordEncoder.encode(dto.getPassword()));
    user.setFullName(dto.getFullName().trim());
    userRepository.save(user);
}

public void createUser(UserDTO dto, String profileImageUrl) {
    // Generate next string ID
    String nextId = "CL00000001";
    Optional<User> maxUserOpt = userRepository.findUserWithMaxId();
    if (maxUserOpt.isPresent()) {
        String maxId = maxUserOpt.get().getId();
        if (maxId != null && maxId.startsWith("CL")) {
            int num = Integer.parseInt(maxId.substring(2));
            nextId = String.format("CL%08d", num + 1);
        }
    }
    User user = new User();
    user.setId(nextId);
    user.setEmail(dto.getEmail().trim().toLowerCase());
    user.setPhoneNumber(dto.getPhoneNumber().trim().replaceAll("\\s+", ""));
    user.setPassword(passwordEncoder.encode(dto.getPassword()));
    user.setFullName(dto.getFullName().trim());
    user.setProfileImageUrl(profileImageUrl);
    userRepository.save(user);
}

public boolean validateLogin(String emailOrPhone, String password) {
    Optional<User> userOpt = userRepository.findByEmailOrPhoneNumber(emailOrPhone, emailOrPhone);
    if (userOpt.isPresent()) {
        User user = userOpt.get();
        // Compare plain password with hashed one using BCrypt
        return BCrypt.checkpw(password, user.getPassword());
    }
    return false;
}

public Optional<User> findByEmail(String email) {
    return userRepository.findByEmail(email);
}
public Optional<User> findByEmailOrPhoneNumber(String emailOrPhone) {
    return userRepository.findByEmailOrPhoneNumber(emailOrPhone, emailOrPhone);
}

public void createUserFromPending(PendingUser pending) {
    // Generate next string ID
    String nextId = "CL00000001";
    Optional<User> maxUserOpt = userRepository.findUserWithMaxId();
    if (maxUserOpt.isPresent()) {
        String maxId = maxUserOpt.get().getId();
        if (maxId != null && maxId.startsWith("CL")) {
            int num = Integer.parseInt(maxId.substring(2));
            nextId = String.format("CL%08d", num + 1);
        }
    }
    User user = new User();
    user.setId(nextId);
    user.setEmail(pending.getEmail().trim().toLowerCase());
    user.setPhoneNumber(pending.getPhoneNumber().trim().replaceAll("\\s+", ""));
    user.setPassword(pending.getPassword());
    user.setFullName(pending.getFullName().trim());
    user.setProfileImageUrl(pending.getProfileImageUrl());
    userRepository.save(user);
}

    @Transactional
    public String createPasswordResetToken(String email) {
        // Remove any existing tokens for this user
        passwordResetTokenRepository.deleteByUserEmail(email);
        String token = UUID.randomUUID().toString();
        Date expiry = new Date(System.currentTimeMillis() + 1000 * 60 * 60); // 1 hour expiry
        PasswordResetToken resetToken = new PasswordResetToken(token, email, expiry);
        passwordResetTokenRepository.save(resetToken);
        return token;
    }

    public boolean validatePasswordResetToken(String token) {
        Optional<PasswordResetToken> opt = passwordResetTokenRepository.findByToken(token);
        if (opt.isEmpty()) return false;
        PasswordResetToken resetToken = opt.get();
        return resetToken.getExpiryDate().after(new Date());
    }

    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> opt = passwordResetTokenRepository.findByToken(token);
        if (opt.isEmpty()) return false;
        PasswordResetToken resetToken = opt.get();
        if (resetToken.getExpiryDate().before(new Date())) return false;
        Optional<User> userOpt = userRepository.findByEmail(resetToken.getUserEmail());
        if (userOpt.isEmpty()) return false;
        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        passwordResetTokenRepository.delete(resetToken);
        return true;
    }
} 
 
 