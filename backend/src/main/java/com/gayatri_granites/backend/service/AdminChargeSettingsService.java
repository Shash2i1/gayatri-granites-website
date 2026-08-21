package com.gayatri_granites.backend.service;

import com.gayatri_granites.backend.dto.ChargeSettingsUpdateRequest;
import com.gayatri_granites.backend.entity.OrderChargeSettings;
import com.gayatri_granites.backend.repository.OrderChargeSettingsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminChargeSettingsService {

    private final OrderChargeSettingsRepository settingsRepository;

    @Transactional(readOnly = true)
    public OrderChargeSettings getSettings() {
        return settingsRepository.findAll().stream()
                .findFirst()
                .orElseGet(() -> OrderChargeSettings.builder()
                        .updatedAt(LocalDateTime.now())
                        .build());
        // returns zero-value defaults if admin has never configured settings yet - not persisted until saved
    }

    @Transactional
    public OrderChargeSettings updateSettings(ChargeSettingsUpdateRequest request) {
        OrderChargeSettings settings = settingsRepository.findAll().stream()
                .findFirst()
                .orElseGet(OrderChargeSettings::new);

        if (request.getGstPercentage() != null) {
            settings.setGstPercentage(request.getGstPercentage());
        }
        if (request.getSgstPercentage() != null) {
            settings.setSgstPercentage(request.getSgstPercentage());
        }
        if (request.getShippingCharge() != null) {
            settings.setShippingCharge(request.getShippingCharge());
        }
        settings.setUpdatedAt(LocalDateTime.now());

        OrderChargeSettings saved = settingsRepository.save(settings);
        log.info("Order charge settings updated: GST%={}, SGST%={}, shipping=₹{}",
                saved.getGstPercentage(), saved.getSgstPercentage(), saved.getShippingCharge());
        return saved;
    }
}