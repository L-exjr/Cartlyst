package com.Cartlyst.CartlystAPI.dto;

public class UserDTO {

    private String fullName;
    private String email;
    private String password;
    private String phoneNumber;
    private String dateRegistered;
    private String dateModified;


    // Constructors
    public UserDTO() {}

    public UserDTO(String fullName, String email, String password, String phoneNumber, String dateRegistered, String dateModified) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.dateRegistered = dateRegistered;
        this.dateModified = dateModified;
    }

    // Getters and Setters
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

    public String getDateRegistered() {
        return dateRegistered;
    }
    public void setDateRegistered(String dateRegistered) {
        this.dateRegistered = dateRegistered;
    }

    public String getDateModified() {
        return dateModified;
    }
    public void setDateModified(String dateModified) {
        this.dateModified = dateModified;
    }
} 