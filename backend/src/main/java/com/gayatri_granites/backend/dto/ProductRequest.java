package com.gayatri_granites.backend.dto;

import com.gayatri_granites.backend.enums.MaterialType;
import com.gayatri_granites.backend.enums.PricingUnit;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequest {
    private String name;
    private String description;
    private Long categoryId;
    private MaterialType materialType;
    private String origin;
    private PricingUnit pricingUnit;
    private BigDecimal basePrice;
    private Integer totalStockQuantity;
}