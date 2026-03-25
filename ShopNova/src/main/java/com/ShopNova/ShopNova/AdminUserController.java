package com.ShopNova.ShopNova;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AdminUserController {
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<Map<String, Object>> users = userRepository.findAll().stream()
            .map(user -> {
                Map<String, Object> userMap = new java.util.HashMap<>();
                userMap.put("id", user.getId());
                userMap.put("firstName", user.getFirstName());
                userMap.put("lastName", user.getLastName());
                userMap.put("email", user.getEmail());
                userMap.put("phone", user.getPhone() != null ? user.getPhone() : "");
                userMap.put("role", user.getRole() != null ? user.getRole() : "CUSTOMER");
                userMap.put("isActive", user.getIsActive());
                userMap.put("createdAt", user.getCreatedAt().toString());
                return userMap;
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(!user.getIsActive());
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User status updated"));
    }
}
