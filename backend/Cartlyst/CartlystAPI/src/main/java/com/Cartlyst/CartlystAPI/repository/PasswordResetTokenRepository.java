package com.Cartlyst.CartlystAPI.repository;

import com.Cartlyst.CartlystAPI.model.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    void deleteByUserEmail(String userEmail);
} 
 
 