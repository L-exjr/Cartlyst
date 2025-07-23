package com.Cartlyst.CartlystAPI.repository;

import com.Cartlyst.CartlystAPI.model.Cart;
import com.Cartlyst.CartlystAPI.model.User;
import com.Cartlyst.CartlystAPI.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUser(User user);
    Optional<Cart> findByUserAndProduct(User user, Product product);

    @Transactional
    void deleteByUser(User user);
}
