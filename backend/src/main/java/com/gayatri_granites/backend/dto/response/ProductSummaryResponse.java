package com.gayatri_granites.backend.dto.response;

import com.gayatri_granites.backend.enums.MaterialType;
import com.gayatri_granites.backend.enums.PricingUnit;
import com.gayatri_granites.backend.enums.StockStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSummaryResponse {
    private Long id;
    private String name;
    private String categoryName;
    private MaterialType materialType;
    private PricingUnit pricingUnit;
    private BigDecimal basePrice;
    private BigDecimal discountPrice;
    private StockStatus stockStatus;
    private String primaryImageUrl; // just the thumbnail, not the full image list
}