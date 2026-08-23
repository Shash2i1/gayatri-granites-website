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
public class DashboardSummaryResponse {
    private long totalOrders;
    private long ordersToday;
    private BigDecimal totalRevenue;
    private BigDecimal revenueThisMonth;
    private long totalProducts;
    private long totalCustomers;
}