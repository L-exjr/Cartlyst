package com.Cartlyst.CartlystAPI.repository;

import com.Cartlyst.CartlystAPI.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;


public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmailOrPhoneNumber(String email, String phone);

    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);

    User findByEmail(String email);
    User findByPhoneNumber(String phoneNumber);

    @Query("SELECT u FROM User u WHERE u.id = (SELECT MAX(u2.id) FROM User u2)")
    Optional<User> findUserWithMaxId();
}
