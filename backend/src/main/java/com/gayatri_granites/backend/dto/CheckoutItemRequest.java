package com.gayatri_granites.backend.dto;

import lombok.Data;

@Data
public class CheckoutItemRequest {
    private Long productId;
    private Long variantId; // nullable
    private Integer quantity;
}