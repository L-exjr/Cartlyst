package com.Cartlyst.CartlystAPI.controller;

import com.Cartlyst.CartlystAPI.model.*;
import com.Cartlyst.CartlystAPI.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/wishlist")
public class WishlistController {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @PostMapping("/add")
    public String addToWishlist(@RequestParam String userId, @RequestParam Long productId) {
        User user = userRepository.findById(userId).orElseThrow();
        Product product = productRepository.findById(productId).orElseThrow();

        if (wishlistRepository.existsByUserAndProduct(user, product)) {
            return "Already in wishlist";
        }

        wishlistRepository.save(new Wishlist(user, product));
        return "Added to wishlist!";
    }

    @GetMapping("/{userId}")
    public List<WishlistProductResponse> getUserWishlist(@PathVariable String userId) {
        User user = userRepository.findById(userId).orElseThrow();
        List<Wishlist> wishlistItems = wishlistRepository.findByUser(user);
        return wishlistItems.stream()
            .map(wishlist -> new WishlistProductResponse(wishlist.getProduct()))
            .collect(Collectors.toList());
    }

    public static class WishlistProductResponse {
        public Long id;
        public String title;
        public String description;
        public double price;
        public int quantity;
        public double discount;
        public double rating;
        public String image;

        public WishlistProductResponse(Product product) {
            this.id = product.getId();
            this.title = product.getTitle();
            this.description = product.getDescription();
            this.price = product.getPrice();
            this.quantity = product.getQuantity();
            this.discount = product.getDiscount();
            this.rating = product.getRating();
            this.image = product.getImage();
        }
    }

    @DeleteMapping("/remove")
    public ResponseEntity<?> removeFromWishlist(@RequestParam String userId, @RequestParam Long productId) {
        User user = userRepository.findById(userId).orElse(null);
        Product product = productRepository.findById(productId).orElse(null);

        if (user == null || product == null) {
            return ResponseEntity.status(404).body("User or product not found");
        }

        // Check if the wishlist item exists
        if (!wishlistRepository.existsByUserAndProduct(user, product)) {
            return ResponseEntity.ok("Wishlist item not found or already removed");
        }

        // Delete the wishlist item
        wishlistRepository.deleteByUserAndProduct(user, product);
        return ResponseEntity.ok("Removed from wishlist");
    }
}
