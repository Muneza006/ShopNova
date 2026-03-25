package com.ShopNova.ShopNova;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/{id}")
    public ResponseEntity<?> getProfile(@PathVariable Long id, Authentication auth) {
        if (!isOwner(id, auth)) return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(Map.of(
                "id",        user.getId(),
                "firstName", user.getFirstName(),
                "lastName",  user.getLastName(),
                "email",     user.getEmail(),
                "phone",     user.getPhone() != null ? user.getPhone() : "",
                "role",      user.getRole()
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Long id,
                                           @RequestBody UpdateProfileRequest req,
                                           Authentication auth) {
        if (!isOwner(id, auth)) return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (req.getFirstName() != null && !req.getFirstName().isBlank())
            user.setFirstName(req.getFirstName());
        if (req.getLastName() != null && !req.getLastName().isBlank())
            user.setLastName(req.getLastName());
        if (req.getPhone() != null)
            user.setPhone(req.getPhone());

        // Password change — only if both fields provided and current password matches
        if (req.getCurrentPassword() != null && req.getNewPassword() != null
                && !req.getNewPassword().isBlank()) {
            if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPassword())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Current password is incorrect"));
            }
            user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        }

        userRepository.save(user);
        return ResponseEntity.ok(Map.of(
                "message",   "Profile updated successfully",
                "id",        user.getId(),
                "firstName", user.getFirstName(),
                "lastName",  user.getLastName(),
                "email",     user.getEmail(),
                "phone",     user.getPhone() != null ? user.getPhone() : "",
                "role",      user.getRole()
        ));
    }

    // Check that the logged-in user is the owner of the profile
    private boolean isOwner(Long id, Authentication auth) {
        if (auth == null) return false;
        User loggedIn = (User) auth.getPrincipal();
        return loggedIn.getId().equals(id);
    }
}

@Data
class UpdateProfileRequest {
    private String firstName;
    private String lastName;
    private String phone;
    private String currentPassword;
    private String newPassword;
}
