package com.gayatri_granites.backend.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class DiscountRequest {
    private BigDecimal discountPrice; // null clears the discount
}