package com.Cartlyst.CartlystAPI.repository;

import com.Cartlyst.CartlystAPI.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
} 