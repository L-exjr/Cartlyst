package com.Cartlyst.CartlystAPI.repository;

import com.Cartlyst.CartlystAPI.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
} 