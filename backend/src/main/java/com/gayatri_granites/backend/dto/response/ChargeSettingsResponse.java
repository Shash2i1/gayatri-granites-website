package com.gayatri_granites.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChargeSettingsResponse {
    private BigDecimal gstPercentage;
    private BigDecimal sgstPercentage;
    private BigDecimal shippingCharge;
    private LocalDateTime updatedAt;
}