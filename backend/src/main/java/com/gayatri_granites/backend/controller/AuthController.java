package com.gayatri_granites.backend.controller;

import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@Slf4j
public class AuthController {

    @GetMapping("/me")
    public ResponseEntity<?> currentUser(Authentication authentication) {

        if (authentication == null) {

            log.warn("Unauthenticated user attempted to access /api/me");

            return ResponseEntity
                    .status(401)
                    .body(Map.of(
                            "success", false,
                            "message", "User is not authenticated"
                    ));
        }

        String email = authentication.getName();

        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse("ROLE_USER")
                .replace("ROLE_", "");

        log.info("Authenticated user [{}] with role [{}] accessed profile.", email, role);

        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "email", email,
                        "role", role
                )
        );
    }

}