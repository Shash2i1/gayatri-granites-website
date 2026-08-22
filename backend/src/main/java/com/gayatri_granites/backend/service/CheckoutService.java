package com.gayatri_granites.backend.service;

import com.gayatri_granites.backend.dto.CheckoutItemRequest;
import com.gayatri_granites.backend.dto.CheckoutRequest;
import com.gayatri_granites.backend.dto.VerifyPaymentRequest;
import com.gayatri_granites.backend.dto.response.CheckoutOrderResponse;
import com.gayatri_granites.backend.dto.response.OrderResponse;
import com.gayatri_granites.backend.entity.*;
import com.gayatri_granites.backend.enums.PaymentStatus;
import com.gayatri_granites.backend.enums.OrderStatus;
import com.gayatri_granites.backend.mapper.OrderMapper;
import com.gayatri_granites.backend.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CheckoutService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;
    private final OrderRepository orderRepository;
    private final OrderChargeSettingsRepository chargeSettingsRepository;
    private final UserRepository userRepository;
    private final RazorpayService razorpayService;
    private final OrderMapper orderMapper;

    @Transactional(readOnly = true)
    public CheckoutOrderResponse createRazorpayOrder(CheckoutRequest request, String userEmail) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        PricingResult pricing = computePricing(request.getItems());

        try {
            String receipt = "order_" + UUID.randomUUID().toString().substring(0, 12);
            long amountInPaise = pricing.totalAmount.multiply(BigDecimal.valueOf(100)).longValueExact();

            com.razorpay.Order rzpOrder = razorpayService.createOrder(amountInPaise, "INR", receipt);

            return CheckoutOrderResponse.builder()
                    .razorpayOrderId(rzpOrder.get("id"))
                    .razorpayKeyId(null) // filled by controller from properties, kept out of service
                    .amountInPaise(amountInPaise)
                    .currency("INR")
                    .subtotal(pricing.subtotal)
                    .gstAmount(pricing.gstAmount)
                    .sgstAmount(pricing.sgstAmount)
                    .shippingCharge(pricing.shippingCharge)
                    .totalAmount(pricing.totalAmount)
                    .build();

        } catch (Exception e) {
            log.error("Failed to create Razorpay order", e);
            throw new RuntimeException("Failed to initiate payment. Please try again.");
        }
    }

    @Transactional
    public OrderResponse verifyAndCreateOrder(VerifyPaymentRequest request, String userEmail) {
        boolean valid = razorpayService.verifySignature(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature());

        if (!valid) {
            log.warn("Razorpay signature verification failed for order [{}]", request.getRazorpayOrderId());
            throw new IllegalArgumentException("Payment verification failed");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + userEmail));

        PricingResult pricing = computePricing(request.getItems());

        Order order = Order.builder()
                .user(user)
                .phoneNumber(request.getPhoneNumber())
                .shippingAddress(request.getShippingAddress())
                .status(OrderStatus.CONFIRMED)
                .paymentStatus(PaymentStatus.PAID)
                .razorpayOrderId(request.getRazorpayOrderId())
                .razorpayPaymentId(request.getRazorpayPaymentId())
                .subtotal(pricing.subtotal)
                .gstPercentage(pricing.gstPercentage)
                .gstAmount(pricing.gstAmount)
                .sgstPercentage(pricing.sgstPercentage)
                .sgstAmount(pricing.sgstAmount)
                .shippingCharge(pricing.shippingCharge)
                .totalAmount(pricing.totalAmount)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        List<OrderItem> orderItems = new ArrayList<>();
        for (PricedItem item : pricing.items) {
            orderItems.add(OrderItem.builder()
                    .order(order)
                    .product(item.product)
                    .variant(item.variant)
                    .quantity(item.quantity)
                    .priceAtPurchase(item.unitPrice)
                    .build());
        }
        order.setItems(orderItems);

        Order saved = orderRepository.save(order);
        log.info("Order [{}] created after successful payment, razorpayPaymentId=[{}]",
                saved.getId(), request.getRazorpayPaymentId());

        return orderMapper.toResponse(saved);
    }

    // ---- shared pricing logic used by both create-order and verify-payment ----

    private PricingResult computePricing(List<CheckoutItemRequest> itemRequests) {
        List<PricedItem> pricedItems = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        for (CheckoutItemRequest itemRequest : itemRequests) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Product not found: " + itemRequest.getProductId()));

            if (!Boolean.TRUE.equals(product.getActive())) {
                throw new IllegalArgumentException("Product is no longer available: " + product.getName());
            }

            ProductVariant variant = null;
            BigDecimal unitPrice = product.getDiscountPrice() != null
                    ? product.getDiscountPrice()
                    : product.getBasePrice();

            if (itemRequest.getVariantId() != null) {
                variant = variantRepository.findById(itemRequest.getVariantId())
                        .orElseThrow(() -> new EntityNotFoundException(
                                "Variant not found: " + itemRequest.getVariantId()));

                if (variant.getPriceAdjustment() != null) {
                    unitPrice = unitPrice.add(variant.getPriceAdjustment());
                }
            }

            int quantity = itemRequest.getQuantity() != null ? itemRequest.getQuantity() : 0;
            if (quantity <= 0) {
                throw new IllegalArgumentException("Invalid quantity for product: " + product.getName());
            }

            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(quantity));
            subtotal = subtotal.add(lineTotal);

            pricedItems.add(new PricedItem(product, variant, quantity, unitPrice));
        }

        OrderChargeSettings settings = chargeSettingsRepository.findAll().stream()
                .findFirst()
                .orElseGet(() -> OrderChargeSettings.builder().build());

        BigDecimal gstPercentage = settings.getGstPercentage() != null ? settings.getGstPercentage() : BigDecimal.ZERO;
        BigDecimal sgstPercentage = settings.getSgstPercentage() != null ? settings.getSgstPercentage() : BigDecimal.ZERO;
        BigDecimal shippingCharge = settings.getShippingCharge() != null ? settings.getShippingCharge() : BigDecimal.ZERO;

        BigDecimal gstAmount = subtotal.multiply(gstPercentage)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal sgstAmount = subtotal.multiply(sgstPercentage)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

        BigDecimal totalAmount = subtotal.add(gstAmount).add(sgstAmount).add(shippingCharge);

        PricingResult result = new PricingResult();
        result.items = pricedItems;
        result.subtotal = subtotal;
        result.gstPercentage = gstPercentage;
        result.gstAmount = gstAmount;
        result.sgstPercentage = sgstPercentage;
        result.sgstAmount = sgstAmount;
        result.shippingCharge = shippingCharge;
        result.totalAmount = totalAmount;
        return result;
    }

    private static class PricedItem {
        Product product;
        ProductVariant variant;
        int quantity;
        BigDecimal unitPrice;

        PricedItem(Product product, ProductVariant variant, int quantity, BigDecimal unitPrice) {
            this.product = product;
            this.variant = variant;
            this.quantity = quantity;
            this.unitPrice = unitPrice;
        }
    }

    private static class PricingResult {
        List<PricedItem> items;
        BigDecimal subtotal;
        BigDecimal gstPercentage;
        BigDecimal gstAmount;
        BigDecimal sgstPercentage;
        BigDecimal sgstAmount;
        BigDecimal shippingCharge;
        BigDecimal totalAmount;
    }
}