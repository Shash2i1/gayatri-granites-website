package com.gayatri_granites.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "order_charge_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderChargeSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Builder.Default
    private BigDecimal gstPercentage = BigDecimal.ZERO;      // e.g. 1.50 = 1.5%

    @Builder.Default
    private BigDecimal sgstPercentage = BigDecimal.ZERO;     // e.g. 1.50 = 1.5%

    @Builder.Default
    private BigDecimal shippingCharge = BigDecimal.ZERO;     // flat ₹ amount

    private LocalDateTime updatedAt;
}