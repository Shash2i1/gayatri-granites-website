package com.gayatri_granites.backend.mapper;

import com.gayatri_granites.backend.dto.response.OrderItemResponse;
import com.gayatri_granites.backend.dto.response.OrderResponse;
import com.gayatri_granites.backend.entity.Order;
import com.gayatri_granites.backend.entity.OrderItem;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class OrderMapper {

    public OrderResponse toResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .userEmail(order.getUser().getEmail())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .shippingAddress(order.getShippingAddress())
                .transportDetails(order.getTransportDetails())
                .refundReason(order.getRefundReason())
                .items(toItemResponses(order.getItems()))
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    public List<OrderResponse> toResponseList(List<Order> orders) {
        return orders.stream().map(this::toResponse).collect(Collectors.toList());
    }

    private OrderItemResponse toItemResponse(OrderItem item) {
        return OrderItemResponse.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .variantId(item.getVariant() != null ? item.getVariant().getId() : null)
                .variantSku(item.getVariant() != null ? item.getVariant().getSku() : null)
                .quantity(item.getQuantity())
                .priceAtPurchase(item.getPriceAtPurchase())
                .build();
    }

    private List<OrderItemResponse> toItemResponses(List<OrderItem> items) {
        return items.stream().map(this::toItemResponse).collect(Collectors.toList());
    }
}