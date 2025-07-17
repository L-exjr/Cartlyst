package com.Cartlyst.CartlystAPI.controller;

import com.Cartlyst.CartlystAPI.model.*;
import com.Cartlyst.CartlystAPI.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
public class OrderController {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CartRepository cartRepository;

    @PostMapping("/checkout")
    public Map<String, Object> checkout(@RequestBody CheckoutRequest request) {
        User user = userRepository.findById(request.userId).orElseThrow();
        List<OrderItem> orderItems = new ArrayList<>();
        double total = 0;
        for (CheckoutItem item : request.items) {
            Product product = productRepository.findById(item.productId).orElseThrow();
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(item.quantity);
            orderItem.setPrice(item.price);
            orderItems.add(orderItem);
            total += item.price * item.quantity;
        }
        Order order = new Order();
        order.setUser(user);
        order.setItems(orderItems);
        order.setTotal(total);
        order.setShippingName(request.shippingName);
        order.setShippingAddress(request.shippingAddress);
        order.setShippingPhone(request.shippingPhone);
        order.setCreatedAt(new Date());
        order.setStatus("PLACED");
        order = orderRepository.save(order);
        for (OrderItem item : orderItems) {
            item.setOrder(order);
            orderItemRepository.save(item);
        }
        cartRepository.deleteByUser(user);
        Map<String, Object> response = new HashMap<>();
        response.put("orderId", order.getId());
        response.put("status", "success");
        return response;
    }

    public static class CheckoutRequest {
        public String userId;
        public List<CheckoutItem> items;
        public String shippingName;
        public String shippingAddress;
        public String shippingPhone;
    }
    public static class CheckoutItem {
        public Long productId;
        public int quantity;
        public double price;
    }
} 