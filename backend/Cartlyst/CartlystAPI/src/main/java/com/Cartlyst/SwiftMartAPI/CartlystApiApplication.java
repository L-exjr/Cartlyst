package com.Cartlyst.CartlystAPI;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = "com.Cartlyst.CartlystAPI.model")
public class CartlystApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(CartlystApiApplication.class, args);
    }
}
