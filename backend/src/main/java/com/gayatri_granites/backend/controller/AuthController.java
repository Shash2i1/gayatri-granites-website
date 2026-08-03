package com.gayatri_granites.backend.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AuthController {

    @GetMapping("/me")
    public String currentUser(
            Authentication authentication) {

        return authentication.getName();
    }
}