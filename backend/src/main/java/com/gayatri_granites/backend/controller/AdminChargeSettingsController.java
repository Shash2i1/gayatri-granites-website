package com.gayatri_granites.backend.controller;

import com.gayatri_granites.backend.dto.ChargeSettingsUpdateRequest;
import com.gayatri_granites.backend.dto.response.ChargeSettingsResponse;
import com.gayatri_granites.backend.entity.OrderChargeSettings;
import com.gayatri_granites.backend.service.AdminChargeSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/settings/charges")
@RequiredArgsConstructor
public class AdminChargeSettingsController {

    private final AdminChargeSettingsService settingsService;

    @GetMapping
    public ResponseEntity<ChargeSettingsResponse> getSettings() {
        OrderChargeSettings settings = settingsService.getSettings();
        return ResponseEntity.ok(toResponse(settings));
    }

    @PutMapping
    public ResponseEntity<ChargeSettingsResponse> updateSettings(@RequestBody ChargeSettingsUpdateRequest request) {
        OrderChargeSettings saved = settingsService.updateSettings(request);
        return ResponseEntity.ok(toResponse(saved));
    }

    private ChargeSettingsResponse toResponse(OrderChargeSettings settings) {
        return ChargeSettingsResponse.builder()
                .gstPercentage(settings.getGstPercentage())
                .sgstPercentage(settings.getSgstPercentage())
                .shippingCharge(settings.getShippingCharge())
                .updatedAt(settings.getUpdatedAt())
                .build();
    }
}