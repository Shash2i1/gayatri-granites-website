package com.gayatri_granites.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class VerifyPaymentRequest {
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
    private List<CheckoutItemRequest> items;   
    private String shippingAddress;
    private String phoneNumber;
}