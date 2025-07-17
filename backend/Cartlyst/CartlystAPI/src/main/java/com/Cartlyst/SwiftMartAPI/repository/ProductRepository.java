package com.Cartlyst.CartlystAPI.repository;

import com.Cartlyst.CartlystAPI.model.Category;
import com.Cartlyst.CartlystAPI.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(Category category);

    @Query(value = "SELECT * FROM products p WHERE p.category_id = :categoryId"
            + " AND (:minPrice IS NULL OR p.price >= :minPrice)"
            + " AND (:maxPrice IS NULL OR p.price <= :maxPrice)"
            + " AND (:minDiscount IS NULL OR p.discount >= :minDiscount)"
            + " AND (:maxDiscount IS NULL OR p.discount <= :maxDiscount)"
            + " AND (:minRating IS NULL OR p.rating >= :minRating)"
            + " AND (:maxRating IS NULL OR p.rating <= :maxRating)"
            + " AND ((:search IS NULL) OR (LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%'))))",
            nativeQuery = true)
    List<Product> filterProductsByCategory(
            @Param("categoryId") Long categoryId,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("minDiscount") Double minDiscount,
            @Param("maxDiscount") Double maxDiscount,
            @Param("minRating") Double minRating,
            @Param("maxRating") Double maxRating,
            @Param("search") String search
    );
}
