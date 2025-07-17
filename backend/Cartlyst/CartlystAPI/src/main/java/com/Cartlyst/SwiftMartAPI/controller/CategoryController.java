package com.Cartlyst.CartlystAPI.controller;

import com.Cartlyst.CartlystAPI.model.Category;
import com.Cartlyst.CartlystAPI.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@CrossOrigin(origins = "*") // Allow frontend from any origin (you fit restrict this later)
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    // GET /categories
    @GetMapping
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // POST /categories (optional - if you want to add categories from frontend/admin)
    @PostMapping
    public Category createCategory(@RequestBody Category category) {
        return categoryRepository.save(category);
    }
}
