package com.Cartlyst.CartlystAPI.repository;

import com.Cartlyst.CartlystAPI.model.ChatMessage;
import com.Cartlyst.CartlystAPI.model.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {
    List<ChatMessage> findBySessionOrderByTimestampAsc(ChatSession session);
} 