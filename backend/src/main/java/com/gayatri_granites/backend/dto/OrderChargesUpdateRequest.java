package com.gayatri_granites.backend.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderChargesUpdateRequest {
    private BigDecimal gstAmount;
    private BigDecimal sgstAmount;
    private BigDecimal shippingAndOtherCharges;
}