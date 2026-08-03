package com.gayatri_granites.backend.security;

import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler
        implements AuthenticationSuccessHandler {

    private final JwtService jwtService;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication)
            throws IOException {

        OAuth2User user =
                (OAuth2User) authentication.getPrincipal();

        String email =
                user.getAttribute("email");

        String jwt =
                jwtService.generateToken(email);

        ResponseCookie cookie =
                ResponseCookie.from("token", jwt)
                        .httpOnly(true)
                        .secure(false)
                        .path("/")
                        .maxAge(86400)
                        .sameSite("Lax")
                        .build();

        response.addHeader(
                "Set-Cookie",
                cookie.toString()
        );

        response.sendRedirect(
                "http://localhost:3000/dashboard"
        );
    }
}