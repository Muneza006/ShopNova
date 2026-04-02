package com.ShopNova.ShopNova;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email     = oAuth2User.getAttribute("email");
        String firstName = oAuth2User.getAttribute("given_name");
        String lastName  = oAuth2User.getAttribute("family_name");

        // Find or create user
        boolean isNewUser = !userRepository.existsByEmail(email);
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = User.builder()
                    .email(email)
                    .password("")
                    .firstName(firstName != null ? firstName : "User")
                    .lastName(lastName != null ? lastName : "")
                    .role("CUSTOMER")
                    .isActive(true)
                    .build();
            return userRepository.save(newUser);
        });

        // Block check — redirect with error if user is blocked
        if (!Boolean.TRUE.equals(user.getIsActive())) {
            String blockedUrl = "http://localhost:5173/oauth2/callback?error=blocked";
            getRedirectStrategy().sendRedirect(request, response, blockedUrl);
            return;
        }

        String token = jwtUtil.generateToken(user);

        // Send welcome email on every login
        emailService.sendWelcomeEmail(user.getEmail(), user.getFirstName());

        // Redirect to frontend with token and user info
        String redirectUrl = String.format(
            "http://localhost:5173/oauth2/callback?token=%s&id=%d&email=%s&firstName=%s&lastName=%s&role=%s",
            token, user.getId(), user.getEmail(),
            user.getFirstName(), user.getLastName(), user.getRole()
        );

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
