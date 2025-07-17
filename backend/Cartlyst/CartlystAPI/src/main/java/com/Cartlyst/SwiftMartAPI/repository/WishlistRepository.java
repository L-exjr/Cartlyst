package com.Cartlyst.CartlystAPI.repository;

import com.Cartlyst.CartlystAPI.model.Wishlist;
import com.Cartlyst.CartlystAPI.model.User;
import com.Cartlyst.CartlystAPI.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUser(User user);
    boolean existsByUserAndProduct(User user, Product product);
    
    @Transactional
    void deleteByUserAndProduct(User user, Product product);
}
