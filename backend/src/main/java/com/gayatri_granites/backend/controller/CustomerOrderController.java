package com.gayatri_granites.backend.controller;

import com.gayatri_granites.backend.dto.response.OrderResponse;
import com.gayatri_granites.backend.service.AdminOrderService;
import com.gayatri_granites.backend.service.CustomerOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class CustomerOrderController {

    private final CustomerOrderService customerOrderService;
    private final AdminOrderService adminOrderService; // reused only for its PDF-generation logic

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getMyOrders(Authentication authentication) {
        return ResponseEntity.ok(customerOrderService.getMyOrders(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getMyOrder(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(customerOrderService.getMyOrder(id, authentication.getName()));
    }

    @GetMapping("/{id}/invoice")
    public ResponseEntity<byte[]> downloadInvoice(@PathVariable Long id, Authentication authentication) {
        // ownership check first - throws 404 if this order isn't the caller's
        customerOrderService.getMyOrderForInvoice(id, authentication.getName());

        byte[] pdf = adminOrderService.generateInvoice(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"invoice-order-" + id + ".pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .contentLength(pdf.length)
                .body(pdf);
    }
}