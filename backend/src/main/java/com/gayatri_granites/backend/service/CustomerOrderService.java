package com.gayatri_granites.backend.service;

import com.gayatri_granites.backend.dto.response.OrderResponse;
import com.gayatri_granites.backend.entity.Order;
import com.gayatri_granites.backend.entity.User;
import com.gayatri_granites.backend.mapper.OrderMapper;
import com.gayatri_granites.backend.repository.OrderRepository;
import com.gayatri_granites.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerOrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final OrderMapper orderMapper;

    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders(String userEmail) {
        User user = findUser(userEmail);
        return orderMapper.toResponseList(orderRepository.findByUserId(user.getId()));
    }

    @Transactional(readOnly = true)
    public OrderResponse getMyOrder(Long orderId, String userEmail) {
        Order order = findOwnedOrder(orderId, userEmail);
        return orderMapper.toResponse(order);
    }

    @Transactional(readOnly = true)
    public Order getMyOrderForInvoice(Long orderId, String userEmail) {
        return findOwnedOrder(orderId, userEmail);
    }

    private Order findOwnedOrder(Long orderId, String userEmail) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found: " + orderId));

        if (!order.getUser().getEmail().equals(userEmail)) {
            // deliberately the same 404 an admin-only or nonexistent order would give -
            // don't reveal that an order with this id exists but belongs to someone else
            throw new EntityNotFoundException("Order not found: " + orderId);
        }

        return order;
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + email));
    }
}