package com.gayatri_granites.backend.entity;

import com.gayatri_granites.backend.enums.OrderStatus;
import com.gayatri_granites.backend.enums.PaymentStatus;

import jakarta.persistence.*;

import lombok.*;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String phoneNumber;

    @OneToMany(
            mappedBy = "order",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;

    // ==============================
    // PRICE DETAILS
    // ==============================

    /**
     * Total price of all products before taxes and shipping.
     */
    @Builder.Default
    private BigDecimal subtotal = BigDecimal.ZERO;

    /**
     * GST percentage applied to this order.
     * Example: 9.00 = 9%
     */  
    @Builder.Default
    private BigDecimal gstPercentage = BigDecimal.ZERO;

    /**
     * GST amount calculated for this order.
     */
    @Builder.Default
    private BigDecimal gstAmount = BigDecimal.ZERO;

    /**
     * SGST percentage applied to this order.
     * Example: 9.00 = 9%
     */
    @Builder.Default
    private BigDecimal sgstPercentage = BigDecimal.ZERO;

    /**
     * SGST amount calculated for this order.
     */
    @Builder.Default
    private BigDecimal sgstAmount = BigDecimal.ZERO;

    /**
     * Shipping / other charges applied to this order.
     */
    @Builder.Default
    private BigDecimal shippingCharge = BigDecimal.ZERO;

    /**
     * Final amount payable by the customer.
     */
    @Builder.Default
    private BigDecimal totalAmount = BigDecimal.ZERO;

    // ==============================
    // SHIPPING DETAILS
    // ==============================

    @Column(length = 1000)
    private String shippingAddress;

    @Column(length = 1000)
    private String transportDetails;
    
    private String razorpayOrderId;
    private String razorpayPaymentId;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    // ==============================
    // REFUND DETAILS
    // ==============================

    @Column(length = 1000)
    private String refundReason;

    

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}