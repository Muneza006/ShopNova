package com.ShopNova.ShopNova;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AuthController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final PasswordResetTokenRepository tokenRepository;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (!request.getEmail().matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email you entered is not correct"));
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
        }

        String verificationToken = java.util.UUID.randomUUID().toString();

        User user = User.builder()
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .phone(request.getPhone())
            .isActive(false)
            .emailVerified(false)
            .verificationToken(verificationToken)
            .build();

        userRepository.save(user);

        String verifyLink = "http://localhost:5173/verify-email?token=" + verificationToken;
        emailService.sendVerificationEmail(user.getEmail(), user.getFirstName(), verifyLink);

        return ResponseEntity.ok(Map.of(
            "message", "Registration successful! Please check your email to verify your account."
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid email or password"));
        }

        if (!Boolean.TRUE.equals(user.getEmailVerified())) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Please verify your email before logging in. Check your inbox for the verification link."
            ));
        }

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            return ResponseEntity.status(403).body(Map.of("error", "Your account has been blocked. Please contact support."));
        }
        String token = jwtUtil.generateToken(user);
        emailService.sendWelcomeEmail(user.getEmail(), user.getFirstName());
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login successful");
        response.put("token", token);
        response.put("user", Map.of(
            "id", user.getId(),
            "email", user.getEmail(),
            "firstName", user.getFirstName(),
            "lastName", user.getLastName(),
            "role", user.getRole()
        ));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        User user = userRepository.findByVerificationToken(token).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired verification link"));
        }
        user.setIsActive(true);
        user.setEmailVerified(true);
        user.setVerificationToken(null);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Email verified successfully! You can now login."));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        User user = userRepository.findByEmail(email).orElse(null);
        
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email not found"));
        }

        String token = java.util.UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
            .token(token)
            .user(user)
            .expiryDate(java.time.LocalDateTime.now().plusHours(1))
            .used(false)
            .build();
        
        tokenRepository.save(resetToken);
        
        String resetLink = "http://localhost:5173/reset-password?token=" + token;
        emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
        
        return ResponseEntity.ok(Map.of("message", "Password reset link sent to your email"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("password");
        
        PasswordResetToken resetToken = tokenRepository.findByToken(token).orElse(null);
        
        if (resetToken == null || resetToken.getUsed() || 
            resetToken.getExpiryDate().isBefore(java.time.LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired token"));
        }
        
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        resetToken.setUsed(true);
        tokenRepository.save(resetToken);
        
        return ResponseEntity.ok(Map.of("message", "Password reset successful"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(org.springframework.security.core.Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(401).body(Map.of("error", "User not found"));
        return ResponseEntity.ok(Map.of(
            "id", user.getId(),
            "email", user.getEmail(),
            "firstName", user.getFirstName(),
            "lastName", user.getLastName(),
            "role", user.getRole()
        ));
    }
}

@lombok.Data
class RegisterRequest {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String phone;
}

@lombok.Data
class LoginRequest {
    private String email;
    private String password;
}
