package com.ShopNova.ShopNova;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ProductController {
    private final ProductService productService;

    // ── Public endpoints ──────────────────────────────────────────────
    @GetMapping("/api/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllActiveProducts());
    }

    @GetMapping("/api/products/featured")
    public ResponseEntity<List<Product>> getFeaturedProducts() {
        return ResponseEntity.ok(productService.getFeaturedProducts());
    }

    @GetMapping("/api/products/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/api/products/slug/{slug}")
    public ResponseEntity<Product> getProductBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(productService.getProductBySlug(slug));
    }

    @GetMapping("/api/products/category/{categoryId}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(productService.getProductsByCategory(categoryId));
    }

    @GetMapping("/api/products/search")
    public ResponseEntity<List<Product>> search(@RequestParam String q) {
        return ResponseEntity.ok(productService.searchProducts(q));
    }

    // ── Admin CRUD endpoints ──────────────────────────────────────────
    @GetMapping("/api/admin/products")
    public ResponseEntity<List<Product>> adminGetAll() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @PostMapping("/api/admin/products")
    public ResponseEntity<Product> create(@RequestBody ProductRequest req) {
        try {
            return ResponseEntity.ok(productService.createProduct(req));
        } catch (Exception e) {
            throw new RuntimeException("Failed to create product: " + e.getMessage(), e);
        }
    }

    @PutMapping("/api/admin/products/{id}")
    public ResponseEntity<Product> update(@PathVariable Long id, @RequestBody ProductRequest req) {
        return ResponseEntity.ok(productService.updateProduct(id, req));
    }

    @DeleteMapping("/api/admin/products/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
