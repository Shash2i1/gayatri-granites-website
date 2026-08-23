package com.gayatri_granites.backend.controller;

import com.gayatri_granites.backend.dto.response.ChargeSettingsResponse;
import com.gayatri_granites.backend.service.AdminChargeSettingsService;
import com.gayatri_granites.backend.entity.OrderChargeSettings;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/settings/charges")
@RequiredArgsConstructor
public class PublicChargeSettingsController {

    private final AdminChargeSettingsService settingsService;

    @GetMapping
    public ResponseEntity<ChargeSettingsResponse> getSettings() {
        OrderChargeSettings settings = settingsService.getSettings();
        return ResponseEntity.ok(ChargeSettingsResponse.builder()
                .gstPercentage(settings.getGstPercentage())
                .sgstPercentage(settings.getSgstPercentage())
                .shippingCharge(settings.getShippingCharge())
                .updatedAt(settings.getUpdatedAt())
                .build());
    }
}