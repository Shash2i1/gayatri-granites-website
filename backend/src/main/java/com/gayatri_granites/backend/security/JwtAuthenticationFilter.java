package com.gayatri_granites.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String requestURI = request.getRequestURI();

        log.debug("Processing request : {}", requestURI);

        try {

            if (SecurityContextHolder.getContext().getAuthentication() == null) {

                Cookie[] cookies = request.getCookies();

                if (cookies != null) {

                    for (Cookie cookie : cookies) {

                        if ("token".equals(cookie.getName())) {

                            String token = cookie.getValue();

                            if (jwtService.isTokenValid(token)) {

                                String email = jwtService.extractEmail(token);
                                String role = jwtService.extractRole(token);

                                if (role == null || role.isBlank()) {
                                    role = "USER"; // safe fallback for older tokens
                                }

                                UsernamePasswordAuthenticationToken authentication =
                                        new UsernamePasswordAuthenticationToken(
                                                email,
                                                null,
                                                List.of(new SimpleGrantedAuthority("ROLE_" + role))
                                        );

                                SecurityContextHolder.getContext()
                                        .setAuthentication(authentication);

                                log.info("User [{}] authenticated successfully with role [{}].", email, role);

                            } else {
                                log.warn("Invalid JWT token received.");
                            }

                            break;
                        }
                    }

                } else {
                    log.debug("No cookies found in request.");
                }

            }

        } catch (Exception e) {

            SecurityContextHolder.clearContext();
            log.error("JWT Authentication failed.", e);

        }

        filterChain.doFilter(request, response);
    }
}