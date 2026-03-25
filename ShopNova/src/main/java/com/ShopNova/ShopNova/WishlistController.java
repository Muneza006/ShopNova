package com.ShopNova.ShopNova;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class WishlistController {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;

    // GET all wishlist items for logged-in user
    @GetMapping
    public ResponseEntity<?> getWishlist(Authentication auth) {
        User user = (User) auth.getPrincipal();
        List<Product> products = wishlistRepository.findByUserId(user.getId())
                .stream().map(Wishlist::getProduct).collect(Collectors.toList());
        return ResponseEntity.ok(products);
    }

    // POST add product to wishlist
    @PostMapping("/{productId}")
    public ResponseEntity<?> addToWishlist(@PathVariable Long productId, Authentication auth) {
        User user = (User) auth.getPrincipal();
        if (wishlistRepository.existsByUserIdAndProductId(user.getId(), productId)) {
            return ResponseEntity.ok(Map.of("message", "Already in wishlist"));
        }
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        wishlistRepository.save(Wishlist.builder().user(user).product(product).build());
        return ResponseEntity.ok(Map.of("message", "Added to wishlist"));
    }

    // DELETE remove product from wishlist
    @DeleteMapping("/{productId}")
    @Transactional
    public ResponseEntity<?> removeFromWishlist(@PathVariable Long productId, Authentication auth) {
        User user = (User) auth.getPrincipal();
        wishlistRepository.deleteByUserIdAndProductId(user.getId(), productId);
        return ResponseEntity.ok(Map.of("message", "Removed from wishlist"));
    }
}
