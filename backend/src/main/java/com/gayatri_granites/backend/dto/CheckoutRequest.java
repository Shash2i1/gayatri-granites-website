package com.gayatri_granites.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class CheckoutRequest {
    private List<CheckoutItemRequest> items;
    private String shippingAddress;
    private String phoneNumber;
}