package com.gayatri_granites.backend.controller;

import com.gayatri_granites.backend.dto.OrderStatusUpdateRequest;
import com.gayatri_granites.backend.dto.RefundRequest;
import com.gayatri_granites.backend.dto.TransportAssignRequest;
import com.gayatri_granites.backend.dto.response.OrderResponse;
import com.gayatri_granites.backend.service.AdminOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final AdminOrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrder(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateStatus(@PathVariable Long id,
                                                         @RequestBody OrderStatusUpdateRequest request) {
        return ResponseEntity.ok(orderService.updateStatus(id, request));
    }

    @PutMapping("/{id}/assign-transport")
    public ResponseEntity<OrderResponse> assignTransport(@PathVariable Long id,
                                                            @RequestBody TransportAssignRequest request) {
        return ResponseEntity.ok(orderService.assignTransport(id, request));
    }

    @PostMapping("/{id}/invoice")
    public ResponseEntity<?> generateInvoice(@PathVariable Long id) {
        OrderResponse order = orderService.getOrderForInvoice(id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Invoice generation not yet implemented",
                "orderId", order.getId()
        ));
    }

    @PutMapping("/{id}/refund")
    public ResponseEntity<OrderResponse> processRefund(@PathVariable Long id,
                                                          @RequestBody RefundRequest request) {
        return ResponseEntity.ok(orderService.processRefund(id, request));
    }
}