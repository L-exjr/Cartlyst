package com.Cartlyst.CartlystAPI.repository;

import com.Cartlyst.CartlystAPI.model.FeaturedProduct;
import com.Cartlyst.CartlystAPI.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeaturedProductRepository extends JpaRepository<FeaturedProduct, Long> {
    boolean existsByProduct(Product product);
    void deleteByProduct(Product product);
}
