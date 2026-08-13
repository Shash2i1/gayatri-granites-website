package com.gayatri_granites.backend.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PriceUpdateRequest {
    private BigDecimal basePrice;
}