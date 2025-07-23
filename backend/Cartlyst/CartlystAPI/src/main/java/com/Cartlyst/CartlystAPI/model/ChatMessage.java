package com.Cartlyst.CartlystAPI.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "chat_messages")
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "session_id")
    private ChatSession session;

    private String userId;
    private String role; // "user" or "assistant"
    @Column(columnDefinition = "TEXT")
    private String text;
    private LocalDateTime timestamp;
    @Column(columnDefinition = "TEXT")
    private String extraData; // JSON for products/categories/actions

    public ChatMessage() {}

    public ChatMessage(ChatSession session, String userId, String role, String text, String extraData) {
        this.session = session;
        this.userId = userId;
        this.role = role;
        this.text = text;
        this.timestamp = LocalDateTime.now();
        this.extraData = extraData;
    }

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public ChatSession getSession() { return session; }
    public void setSession(ChatSession session) { this.session = session; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public String getExtraData() { return extraData; }
    public void setExtraData(String extraData) { this.extraData = extraData; }
} 