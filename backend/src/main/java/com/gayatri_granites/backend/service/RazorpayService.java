package com.gayatri_granites.backend.service;

import com.gayatri_granites.backend.config.RazorpayProperties;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class RazorpayService {

    private final RazorpayProperties razorpayProperties;

    public Order createOrder(long amountInPaise, String currency, String receipt) throws Exception {
        RazorpayClient client = new RazorpayClient(razorpayProperties.getKeyId(), razorpayProperties.getKeySecret());

        JSONObject options = new JSONObject();
        options.put("amount", amountInPaise);
        options.put("currency", currency);
        options.put("receipt", receipt);
        options.put("payment_capture", 1);

        Order order = client.orders.create(options);
        log.info("Razorpay order created: [{}] for amount [{}]", order.get("id"), amountInPaise);
        return order;
    }

    public boolean verifySignature(String orderId, String paymentId, String signature) {
        try {
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", orderId);
            attributes.put("razorpay_payment_id", paymentId);
            attributes.put("razorpay_signature", signature);

            return Utils.verifyPaymentSignature(attributes, razorpayProperties.getKeySecret());
        } catch (Exception e) {
            log.error("Razorpay signature verification failed", e);
            return false;
        }
    }
}