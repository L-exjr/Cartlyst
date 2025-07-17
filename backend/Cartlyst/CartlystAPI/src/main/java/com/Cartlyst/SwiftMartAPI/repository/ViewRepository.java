package com.Cartlyst.CartlystAPI.repository;

import com.Cartlyst.CartlystAPI.model.View;
import com.Cartlyst.CartlystAPI.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ViewRepository extends JpaRepository<View, Long> {
    List<View> findByUser(User user);
    Optional<View> findByUserAndProduct(User user, com.Cartlyst.CartlystAPI.model.Product product);
}
