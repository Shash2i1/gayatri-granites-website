package com.gayatri_granites.backend.dto;

import com.gayatri_granites.backend.enums.Finish;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class VariantRequest {
    private String size;
    private Finish finish;
    private BigDecimal thicknessMm;
    private BigDecimal priceAdjustment;
    private Integer stockQuantity;
    private String sku;
}