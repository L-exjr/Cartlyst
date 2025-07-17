package com.Cartlyst.CartlystAPI.dto;

public class OtpDTO {
    private String phoneOrEmail;
    private String otp;
    private String method; // "email" or "sms"

    // Getters and setters
    public String getPhoneOrEmail() {
        return phoneOrEmail;
    }

    public void setPhoneOrEmail(String phoneOrEmail) {
        this.phoneOrEmail = phoneOrEmail;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }
}