package com.gayatri_granites.backend.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ChargeSettingsUpdateRequest {
    private BigDecimal gstPercentage;
    private BigDecimal sgstPercentage;
    private BigDecimal shippingCharge;
}