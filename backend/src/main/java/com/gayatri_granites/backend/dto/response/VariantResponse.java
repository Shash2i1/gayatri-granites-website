package com.gayatri_granites.backend.dto.response;

import com.gayatri_granites.backend.enums.Finish;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VariantResponse {
    private Long id;
    private String size;
    private Finish finish;
    private BigDecimal thicknessMm;
    private BigDecimal priceAdjustment;
    private Integer stockQuantity;
    private String sku;
}