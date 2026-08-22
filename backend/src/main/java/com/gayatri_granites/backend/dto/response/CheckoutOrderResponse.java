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
public class CheckoutOrderResponse {
    private String razorpayOrderId;
    private String razorpayKeyId;      // safe to expose - this is the public key
    private Long amountInPaise;
    private String currency;
    private BigDecimal subtotal;
    private BigDecimal gstAmount;
    private BigDecimal sgstAmount;
    private BigDecimal shippingCharge;
    private BigDecimal totalAmount;
}