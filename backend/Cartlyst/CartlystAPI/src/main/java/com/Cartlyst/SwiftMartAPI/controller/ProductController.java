package com.Cartlyst.CartlystAPI.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.Cartlyst.CartlystAPI.model.Product;
import com.Cartlyst.CartlystAPI.model.Category;
import com.Cartlyst.CartlystAPI.repository.FeaturedProductRepository;
import com.Cartlyst.CartlystAPI.repository.ProductRepository;
import com.Cartlyst.CartlystAPI.repository.CartRepository;
import com.Cartlyst.CartlystAPI.repository.CategoryRepository;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductRepository productRepository;
    private final FeaturedProductRepository featuredProductRepository;
    private final CartRepository cartRepository;
    private final CategoryRepository categoryRepository;

    @Autowired
    public ProductController(ProductRepository productRepository,
                             FeaturedProductRepository featuredProductRepository,
                             CartRepository cartRepository,
                             CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.featuredProductRepository = featuredProductRepository;
        this.cartRepository = cartRepository;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    @GetMapping("/featured")
    public List<Product> getFeaturedProducts() {
        return featuredProductRepository.findAll()
                .stream()
                .map(fp -> fp.getProduct())
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/cart")
    public List<Product> getCartProducts() {
        return cartRepository.findAll()
                .stream()
                .map(cart -> cart.getProduct())
                .collect(Collectors.toList());
    }

    @GetMapping("/views")
    public List<Product> getViewProducts() {
        return cartRepository.findAll()
                .stream()
                .map(cart -> cart.getProduct())
                .collect(Collectors.toList());
    }

    @GetMapping("/by-category/{categoryId}")
    public List<Product> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Double minDiscount,
            @RequestParam(required = false) Double maxDiscount,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Double maxRating,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sort
    ) {
        List<Product> products = productRepository.filterProductsByCategory(
                categoryId,
                minPrice,
                maxPrice,
                minDiscount,
                maxDiscount,
                minRating,
                maxRating,
                (search == null || search.isEmpty()) ? null : search
        );
        if (sort != null) {
            switch (sort) {
                case "priceAsc":
                    products.sort((a, b) -> Double.compare(a.getPrice(), b.getPrice()));
                    break;
                case "priceDesc":
                    products.sort((a, b) -> Double.compare(b.getPrice(), a.getPrice()));
                    break;
                case "discountDesc":
                    products.sort((a, b) -> Double.compare(b.getDiscount(), a.getDiscount()));
                    break;
                case "ratingDesc":
                    products.sort((a, b) -> Double.compare(b.getRating(), a.getRating()));
                    break;
                case "ratingAsc":
                    products.sort((a, b) -> Double.compare(a.getRating(), b.getRating()));
                    break;
                default:
                    break;
            }
        }
        return products;
    }
}
