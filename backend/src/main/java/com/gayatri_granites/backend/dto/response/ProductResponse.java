package com.gayatri_granites.backend.dto.response;

import com.gayatri_granites.backend.enums.MaterialType;
import com.gayatri_granites.backend.enums.PricingUnit;
import com.gayatri_granites.backend.enums.StockStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private CategorySummaryResponse category;
    private MaterialType materialType;
    private String origin;
    private PricingUnit pricingUnit;
    private BigDecimal basePrice;
    private BigDecimal discountPrice;
    private StockStatus stockStatus;
    private Integer totalStockQuantity;
    private Boolean active;
    private List<VariantResponse> variants;
    private List<ImageResponse> images;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}