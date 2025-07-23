package com.Cartlyst.CartlystAPI.repository;

import com.Cartlyst.CartlystAPI.model.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatSessionRepository extends JpaRepository<ChatSession, UUID> {
    List<ChatSession> findByUserIdAndLastActiveAtAfter(String userId, LocalDateTime after);
    Optional<ChatSession> findTopByUserIdOrderByLastActiveAtDesc(String userId);
} 