package com.Cartlyst.CartlystAPI.controller;

import com.Cartlyst.CartlystAPI.model.*;
import com.Cartlyst.CartlystAPI.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @PostMapping("/add")
    public String addToCart(@RequestParam String userId, @RequestParam Long productId, @RequestParam int quantity) {
        User user = userRepository.findById(userId).orElseThrow();
        Product product = productRepository.findById(productId).orElseThrow();

        Cart cartItem = cartRepository.findByUserAndProduct(user, product).orElse(null);

        if (cartItem != null) {
            cartItem.setQuantity(quantity); // Set to requested value
            cartRepository.save(cartItem);
        } else {
            cartRepository.save(new Cart(user, product, quantity));
        }

        return "Added to cart!";
    }

    @GetMapping("/{userId}")
    public List<CartProductResponse> getUserCart(@PathVariable String userId) {
        User user = userRepository.findById(userId).orElseThrow();
        List<Cart> cartItems = cartRepository.findByUser(user);
        return cartItems.stream()
            .map(cart -> new CartProductResponse(cart.getProduct(), cart.getQuantity()))
            .collect(Collectors.toList());
    }

    public static class CartProductResponse {
        public Long id;
        public String title;
        public String description;
        public double price;
        public int quantity;
        public double discount;
        public double rating;
        public String image;
        public int cartQuantity;

        public CartProductResponse(Product product, int cartQuantity) {
            this.id = product.getId();
            this.title = product.getTitle();
            this.description = product.getDescription();
            this.price = product.getPrice();
            this.quantity = product.getQuantity();
            this.discount = product.getDiscount();
            this.rating = product.getRating();
            this.image = product.getImage();
            this.cartQuantity = cartQuantity;
        }
    }

    @DeleteMapping("/remove")
    public String removeFromCart(@RequestParam String userId, @RequestParam Long productId) {
        User user = userRepository.findById(userId).orElseThrow();
        Product product = productRepository.findById(productId).orElseThrow();

        Cart cartItem = cartRepository.findByUserAndProduct(user, product).orElseThrow();
        cartRepository.delete(cartItem);

        return "Removed from cart";
    }

    @DeleteMapping("/clear")
    public String clearCart(@RequestParam String userId) {
        User user = userRepository.findById(userId).orElseThrow();
        cartRepository.deleteByUser(user);
        return "Cart cleared";
    }
}
