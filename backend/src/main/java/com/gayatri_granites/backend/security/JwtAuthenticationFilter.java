package com.gayatri_granites.backend.security;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain)
            throws ServletException, IOException {

        Cookie[] cookies =
                request.getCookies();

        if (cookies != null) {

            for (Cookie cookie : cookies) {

                if ("token".equals(cookie.getName())) {

                    String token =
                            cookie.getValue();

                    String email =
                            jwtService.extractEmail(token);

                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(
                                    email,
                                    null,
                                    List.of(
                                            new SimpleGrantedAuthority(
                                                    "ROLE_USER")
                                    )
                            );

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(auth);
                }
            }
        }

        chain.doFilter(request, response);
    }
}