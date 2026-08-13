package com.gayatri_granites.backend.service;

import com.gayatri_granites.backend.dto.OrderStatusUpdateRequest;
import com.gayatri_granites.backend.dto.RefundRequest;
import com.gayatri_granites.backend.dto.TransportAssignRequest;
import com.gayatri_granites.backend.dto.response.OrderResponse;
import com.gayatri_granites.backend.entity.Order;
import com.gayatri_granites.backend.enums.OrderStatus;
import com.gayatri_granites.backend.mapper.OrderMapper;
import com.gayatri_granites.backend.repository.OrderRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminOrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderMapper.toResponseList(orderRepository.findAll());
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByStatus(OrderStatus status) {
        return orderMapper.toResponseList(orderRepository.findByStatus(status));
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrder(Long id) {
        return orderMapper.toResponse(findOrderEntity(id));
    }

    @Transactional
    public OrderResponse updateStatus(Long id, OrderStatusUpdateRequest request) {
        Order order = findOrderEntity(id);
        order.setStatus(request.getStatus());
        order.setUpdatedAt(LocalDateTime.now());

        Order saved = orderRepository.save(order);
        log.info("Order [{}] status updated to [{}]", id, request.getStatus());
        return orderMapper.toResponse(saved);
    }

    @Transactional
    public OrderResponse assignTransport(Long id, TransportAssignRequest request) {
        Order order = findOrderEntity(id);
        order.setTransportDetails(request.getTransportDetails());
        order.setUpdatedAt(LocalDateTime.now());

        Order saved = orderRepository.save(order);
        log.info("Transport assigned for order [{}]", id);
        return orderMapper.toResponse(saved);
    }

    @Transactional
    public OrderResponse processRefund(Long id, RefundRequest request) {
        Order order = findOrderEntity(id);
        order.setStatus(OrderStatus.CANCELLED);
        order.setRefundReason(request.getRefundReason());
        order.setUpdatedAt(LocalDateTime.now());

        Order saved = orderRepository.save(order);
        log.info("Refund processed for order [{}], reason=[{}]", id, request.getRefundReason());
        return orderMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderForInvoice(Long id) {
        // stub - wire up a PDF library (OpenPDF / iText) for a real implementation
        return orderMapper.toResponse(findOrderEntity(id));
    }

    private Order findOrderEntity(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found: " + id));
    }
}