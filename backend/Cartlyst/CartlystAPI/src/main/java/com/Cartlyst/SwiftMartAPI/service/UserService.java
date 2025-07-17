package com.Cartlyst.CartlystAPI.service;

import com.Cartlyst.CartlystAPI.model.User;
import com.Cartlyst.CartlystAPI.repository.UserRepository;
import com.Cartlyst.CartlystAPI.dto.UserDTO;
//import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.Optional;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
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

public boolean validateLogin(String emailOrPhone, String password) {
    Optional<User> userOpt = userRepository.findByEmailOrPhoneNumber(emailOrPhone, emailOrPhone);
    if (userOpt.isPresent()) {
        User user = userOpt.get();
        // Compare plain password with hashed one using BCrypt
        return BCrypt.checkpw(password, user.getPassword());
    }
    return false;
}

public User findByEmail(String email) {
    return userRepository.findByEmail(email);
}
public Optional<User> findByEmailOrPhoneNumber(String emailOrPhone) {
    return userRepository.findByEmailOrPhoneNumber(emailOrPhone, emailOrPhone);
}
} 