package com.gayatri_granites.backend.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.gayatri_granites.backend.entity.Role;
import com.gayatri_granites.backend.entity.User;
import com.gayatri_granites.backend.repository.UserRepository;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Value("${frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {

        try {

            OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

            String email = oauthUser.getAttribute("email");

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalStateException(
                            "User not found after OAuth2 login: " + email));

            log.info("Google OAuth login successful for [{}] with role [{}].", email, user.getRole());

            String jwt = jwtService.generateToken(user.getEmail(), user.getRole().name());

            ResponseCookie cookie = ResponseCookie.from("token", jwt)
                    .httpOnly(true)
                    .secure(true)      // Change to true in production (HTTPS)
                    .path("/")
                    .sameSite("None")
                    .maxAge(86400)
                    .build();

            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

            log.info("JWT cookie created successfully for [{}].", email);

            String redirectPath = user.getRole() == Role.ADMIN ? "/admin" : "/";
            response.sendRedirect(frontendUrl + redirectPath);

        } catch (Exception e) {

            log.error("OAuth2 login failed.", e);

            response.sendError(
                    HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "Authentication Failed"
            );
        }
    }
}
