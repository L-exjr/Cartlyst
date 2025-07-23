package com.Cartlyst.CartlystAPI.controller;

import com.Cartlyst.CartlystAPI.model.*;
import com.Cartlyst.CartlystAPI.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.json.JSONObject;
import okhttp3.*;
import java.io.IOException;

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
    public Map<String, Object> checkout(@org.springframework.web.bind.annotation.RequestBody CheckoutRequest request) {
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

    @PostMapping("/api/paystack/init")
    public ResponseEntity<?> initializePaystack(@org.springframework.web.bind.annotation.RequestBody Map<String, Object> payload) {
        System.out.println("Received request to /api/paystack/init: " + payload);
        String email = (String) payload.get("email");
        double amount = ((Number) payload.get("amount")).doubleValue();
        String reference = "txn_" + System.currentTimeMillis();
        String paystackSecretKey = "sk_test_8ea0431a9620223aaa4d37168783e206467da241";
        OkHttpClient client = new OkHttpClient();
        JSONObject json = new JSONObject();
        json.put("email", email);
        json.put("amount", (int)(amount * 100)); // pesewas
        json.put("reference", reference);
        json.put("callback_url", "https://paystack.com/pay/success");
        okhttp3.RequestBody body = okhttp3.RequestBody.create(json.toString(), okhttp3.MediaType.parse("application/json"));
        Request request = new Request.Builder()
                .url("https://api.paystack.co/transaction/initialize")
                .post(body)
                .addHeader("Authorization", "Bearer " + paystackSecretKey)
                .addHeader("Content-Type", "application/json")
                .build();
        try (Response response = client.newCall(request).execute()) {
            String responseBody = response.body().string();
            if (!response.isSuccessful()) {
                System.out.println("Paystack error: " + responseBody);
                return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body("Failed to initialize payment: " + responseBody);
            }
            JSONObject respJson = new JSONObject(responseBody);
            String url = respJson.getJSONObject("data").getString("authorization_url");
            Map<String, String> result = new HashMap<>();
            result.put("url", url);
            return ResponseEntity.ok(result);
        } catch (IOException e) {
            System.out.println("IOException in /api/paystack/init: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
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