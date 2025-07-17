package com.Cartlyst.CartlystAPI.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(columnNames = "email"),
    @UniqueConstraint(columnNames = "phone_number")
})
public class User {

    @Id
    @Column(name = "id", nullable = false, unique = true, length = 10)
    private String id;

    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "phone_number", nullable = false, unique = true)
    private String phoneNumber;

    private String password;

    private LocalDateTime dateRegistered;
    private LocalDateTime dateModified;

    public User() {}

    public User(String id, String fullName, String email, String password, String phoneNumber) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
    }

    @PrePersist
    protected void onCreate() {
        dateRegistered = LocalDateTime.now();
        dateModified = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        dateModified = LocalDateTime.now();
    }

    // Getters & Setters
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getFullName() {
        return fullName;
    }
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getPhoneNumber() {
        return phoneNumber;
    }
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    public LocalDateTime getDateRegistered() {
        return dateRegistered;
    }
    public LocalDateTime getDateModified() {
        return dateModified;
    }
    public void setDateModified(LocalDateTime dateModified) {
        this.dateModified = dateModified;
    }
    public void setDateRegistered(LocalDateTime dateRegistered) {
        this.dateRegistered = dateRegistered;
    }
}