package com.Cartlyst.CartlystAPI.repository;

import com.Cartlyst.CartlystAPI.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
}
