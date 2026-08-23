package com.gayatri_granites.backend.service;

import com.gayatri_granites.backend.dto.response.DashboardSummaryResponse;
import com.gayatri_granites.backend.dto.response.OrderResponse;
import com.gayatri_granites.backend.dto.response.TopProductResponse;
import com.gayatri_granites.backend.entity.Order;
import com.gayatri_granites.backend.entity.OrderItem;
import com.gayatri_granites.backend.enums.OrderStatus;
import com.gayatri_granites.backend.mapper.OrderMapper;
import com.gayatri_granites.backend.repository.OrderItemRepository;
import com.gayatri_granites.backend.repository.OrderRepository;
import com.gayatri_granites.backend.repository.ProductRepository;
import com.gayatri_granites.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderMapper orderMapper;

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getSummary() {
        List<Order> allOrders = orderRepository.findAll();

        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        LocalDateTime startOfMonth = YearMonth.now().atDay(1).atStartOfDay();

        long ordersToday = allOrders.stream()
                .filter(o -> o.getCreatedAt() != null && !o.getCreatedAt().isBefore(startOfToday))
                .count();

        BigDecimal totalRevenue = allOrders.stream()
                .filter(o -> o.getStatus() != OrderStatus.CANCELLED)
                .map(Order::getTotalAmount)
                .filter(java.util.Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal revenueThisMonth = allOrders.stream()
                .filter(o -> o.getStatus() != OrderStatus.CANCELLED)
                .filter(o -> o.getCreatedAt() != null && !o.getCreatedAt().isBefore(startOfMonth))
                .map(Order::getTotalAmount)
                .filter(java.util.Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return DashboardSummaryResponse.builder()
                .totalOrders(allOrders.size())
                .ordersToday(ordersToday)
                .totalRevenue(totalRevenue)
                .revenueThisMonth(revenueThisMonth)
                .totalProducts(productRepository.count())
                .totalCustomers(userRepository.count())
                .build();
    }

    @Transactional(readOnly = true)
    public List<TopProductResponse> getTopProducts(int limit) {
        List<OrderItem> items = orderItemRepository.findAll();

        Map<String, Long> quantityByProduct = items.stream()
                .collect(Collectors.groupingBy(
                        i -> i.getProduct().getName(),
                        Collectors.summingLong(OrderItem::getQuantity)
                ));

        return quantityByProduct.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(limit)
                .map(e -> TopProductResponse.builder()
                        .productName(e.getKey())
                        .quantitySold(e.getValue())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getSalesReport(LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(23, 59, 59);
        List<Order> orders = orderRepository.findByCreatedAtBetween(start, end);
        return orderMapper.toResponseList(orders);
    }
}