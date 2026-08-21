package com.gayatri_granites.backend.dto;

import com.gayatri_granites.backend.enums.OrderStatus;
import lombok.Data;

@Data
public class OrderStatusUpdateRequest {
    private OrderStatus status;
}