package com.gayatri_granites.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderChargesResponse {
    private BigDecimal gstPercentageApplied;
    private BigDecimal sgstPercentageApplied;
    private BigDecimal gstAmount;
    private BigDecimal sgstAmount;
    private BigDecimal shippingAndOtherCharges;
}