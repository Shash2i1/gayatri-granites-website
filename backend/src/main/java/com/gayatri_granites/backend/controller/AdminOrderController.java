package com.gayatri_granites.backend.controller;

import com.gayatri_granites.backend.dto.OrderStatusUpdateRequest;
import com.gayatri_granites.backend.dto.RefundRequest;
import com.gayatri_granites.backend.dto.TransportAssignRequest;
import com.gayatri_granites.backend.dto.response.OrderResponse;
import com.gayatri_granites.backend.service.AdminOrderService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

	@GetMapping("/{id}/invoice")
	public ResponseEntity<byte[]> downloadInvoice(@PathVariable Long id) {

		byte[] pdf = orderService.generateInvoice(id);

		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"invoice-order-" + id + ".pdf\"")
				.contentType(MediaType.APPLICATION_PDF).contentLength(pdf.length).body(pdf);
	}

	@PutMapping("/{id}/refund")
	public ResponseEntity<OrderResponse> processRefund(@PathVariable Long id, @RequestBody RefundRequest request) {
		return ResponseEntity.ok(orderService.processRefund(id, request));
	}

}