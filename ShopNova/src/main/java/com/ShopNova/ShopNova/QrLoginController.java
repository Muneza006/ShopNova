package com.ShopNova.ShopNova;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/auth/qr")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class QrLoginController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    // token -> QrSession (in-memory, expires in 5 min)
    private final ConcurrentHashMap<String, QrSession> sessions = new ConcurrentHashMap<>();

    static class QrSession {
        String status = "PENDING"; // PENDING | CONFIRMED
        String jwtToken;
        Map<String, Object> user;
        final long expiresAt = Instant.now().plusSeconds(300).toEpochMilli();
    }

    // Step 1: Desktop generates a QR token
    @PostMapping("/generate")
    public ResponseEntity<?> generate() {
        // Clean up expired sessions
        sessions.entrySet().removeIf(e -> Instant.now().toEpochMilli() > e.getValue().expiresAt);

        String token = UUID.randomUUID().toString();
        sessions.put(token, new QrSession());
        return ResponseEntity.ok(Map.of("token", token));
    }

    // Step 2: Desktop polls waiting for confirmation
    @GetMapping("/poll")
    public ResponseEntity<?> poll(@RequestParam String token) {
        QrSession session = sessions.get(token);
        if (session == null || Instant.now().toEpochMilli() > session.expiresAt) {
            sessions.remove(token);
            return ResponseEntity.status(410).body(Map.of("error", "QR code expired"));
        }
        if ("CONFIRMED".equals(session.status)) {
            sessions.remove(token);
            return ResponseEntity.ok(Map.of(
                "status", "confirmed",
                "token", session.jwtToken,
                "user", session.user
            ));
        }
        return ResponseEntity.ok(Map.of("status", "pending"));
    }

    // Step 3: Mobile/logged-in user confirms the QR token
    @PostMapping("/confirm")
    public ResponseEntity<?> confirm(
            @RequestParam String token,
            @RequestHeader("Authorization") String authHeader) {

        QrSession session = sessions.get(token);
        if (session == null || Instant.now().toEpochMilli() > session.expiresAt) {
            sessions.remove(token);
            return ResponseEntity.status(410).body(Map.of("error", "QR code expired or invalid"));
        }

        // Extract user from the bearer token of the confirming device
        String jwt = authHeader.replace("Bearer ", "");
        if (!jwtUtil.isValid(jwt)) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid token"));
        }

        String email = jwtUtil.extractEmail(jwt);
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }

        // Issue a fresh JWT for the desktop session
        String newJwt = jwtUtil.generateToken(user);
        session.jwtToken = newJwt;
        session.user = Map.of(
            "id", user.getId(),
            "email", user.getEmail(),
            "firstName", user.getFirstName(),
            "lastName", user.getLastName(),
            "role", user.getRole() != null ? user.getRole() : "CUSTOMER"
        );
        session.status = "CONFIRMED";

        return ResponseEntity.ok(Map.of("message", "Login confirmed"));
    }
}
