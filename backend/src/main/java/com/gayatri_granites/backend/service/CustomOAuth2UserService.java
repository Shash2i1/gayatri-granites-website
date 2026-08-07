package com.gayatri_granites.backend.service;

import com.gayatri_granites.backend.entity.AdminProperties;
import com.gayatri_granites.backend.entity.Role;
import com.gayatri_granites.backend.entity.User;
import com.gayatri_granites.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final AdminProperties adminProperties;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest)
            throws OAuth2AuthenticationException {

        log.info("Fetching user details from Google.");

        OAuth2User oauth2User = super.loadUser(userRequest);

        try {

            String email = oauth2User.getAttribute("email");
            String name = oauth2User.getAttribute("name");
            String picture = oauth2User.getAttribute("picture");

            if (email == null || email.isBlank()) {
                log.error("Google OAuth response does not contain email.");
                throw new OAuth2AuthenticationException("Email not found from OAuth2 provider.");
            }

            Role role = adminProperties.getEmails().contains(email)
                    ? Role.ADMIN
                    : Role.USER;

            Optional<User> existingUser = userRepository.findByEmail(email);

            User user = existingUser.orElseGet(User::new);
            user.setEmail(email);
            user.setName(name);
            user.setPictureUrl(picture);
            user.setProvider("GOOGLE");
            user.setRole(role); // re-evaluated on every login against current allowlist

            if (existingUser.isEmpty()) {
                user.setCreatedAt(LocalDateTime.now());
                log.info("New user [{}] registered successfully with role [{}].", email, role);
            } else {
                log.info("Existing user [{}] updated successfully with role [{}].", email, role);
            }

            userRepository.save(user);

            return oauth2User;

        } catch (OAuth2AuthenticationException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to process Google OAuth user.", e);
            throw new OAuth2AuthenticationException("Failed to authenticate Google user.");
        }
    }
}