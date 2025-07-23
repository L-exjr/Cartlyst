package com.Cartlyst.CartlystAPI.controller;

import com.Cartlyst.CartlystAPI.model.FeaturedProduct;
import com.Cartlyst.CartlystAPI.model.Product;
import com.Cartlyst.CartlystAPI.repository.FeaturedProductRepository;
import com.Cartlyst.CartlystAPI.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/featured")
public class FeaturedProductController {

    @Autowired
    private FeaturedProductRepository featuredRepo;

    @Autowired
    private ProductRepository productRepo;

    @PostMapping("/add")
    public String addFeatured(@RequestParam Long productId) {
        Product product = productRepo.findById(productId).orElseThrow();

        if (featuredRepo.existsByProduct(product)) {
            return "Product already marked as featured.";
        }

        featuredRepo.save(new FeaturedProduct(product));
        return "Product marked as featured!";
    }

    @GetMapping
    public List<FeaturedProduct> getFeatured() {
        return featuredRepo.findAll();
    }

    @DeleteMapping("/remove")
    public String removeFeatured(@RequestParam Long productId) {
        Product product = productRepo.findById(productId).orElseThrow();
        featuredRepo.deleteByProduct(product);
        return "Product removed from featured list.";
    }
}
