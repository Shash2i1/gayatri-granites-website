package com.gayatri_granites.backend.controller;

import com.gayatri_granites.backend.config.RazorpayProperties;
import com.gayatri_granites.backend.dto.CheckoutRequest;
import com.gayatri_granites.backend.dto.VerifyPaymentRequest;
import com.gayatri_granites.backend.dto.response.CheckoutOrderResponse;
import com.gayatri_granites.backend.dto.response.OrderResponse;
import com.gayatri_granites.backend.service.CheckoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkout")
@RequiredArgsConstructor
public class CheckoutController {

    private final CheckoutService checkoutService;
    private final RazorpayProperties razorpayProperties;

    @PostMapping("/create-order")
    public ResponseEntity<CheckoutOrderResponse> createOrder(@RequestBody CheckoutRequest request,
                                                                Authentication authentication) {
        CheckoutOrderResponse response = checkoutService.createRazorpayOrder(request, authentication.getName());
        response.setRazorpayKeyId(razorpayProperties.getKeyId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<OrderResponse> verifyPayment(@RequestBody VerifyPaymentRequest request,
                                                          Authentication authentication) {
        return ResponseEntity.ok(checkoutService.verifyAndCreateOrder(request, authentication.getName()));
    }
}