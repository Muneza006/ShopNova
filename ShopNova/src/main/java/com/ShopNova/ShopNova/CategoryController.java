package com.ShopNova.ShopNova;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class CategoryController {
    private final CategoryRepository categoryRepository;

    @GetMapping("/api/categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryRepository.findByIsActiveTrue());
    }

    @GetMapping("/api/categories/with-subcategories")
    public ResponseEntity<List<CategoryWithSubcategoriesDTO>> getCategoriesWithSubcategories() {
        List<Category> parentCategories = categoryRepository.findByParentIdIsNullAndIsActiveTrue();
        List<CategoryWithSubcategoriesDTO> result = parentCategories.stream()
            .map(parent -> {
                List<Category> subcategories = categoryRepository.findByParentIdAndIsActiveTrue(parent.getId());
                return CategoryWithSubcategoriesDTO.builder()
                    .id(parent.getId()).name(parent.getName()).slug(parent.getSlug())
                    .description(parent.getDescription()).imageUrl(parent.getImageUrl())
                    .subcategories(subcategories).build();
            }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/api/categories/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Category not found")));
    }

    @GetMapping("/api/categories/slug/{slug}")
    public ResponseEntity<Category> getCategoryBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(categoryRepository.findBySlug(slug)
            .orElseThrow(() -> new RuntimeException("Category not found")));
    }

    // ── Admin endpoints ───────────────────────────────────────────────────
    @GetMapping("/api/admin/categories")
    public ResponseEntity<List<Category>> adminGetAll() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    @PostMapping("/api/admin/categories")
    public ResponseEntity<?> create(@RequestBody Category cat) {
        cat.setSlug(cat.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-"));
        if (cat.getIsActive() == null) cat.setIsActive(true);
        return ResponseEntity.ok(categoryRepository.save(cat));
    }

    @PutMapping("/api/admin/categories/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Category req) {
        Category cat = categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Category not found"));
        cat.setName(req.getName());
        cat.setSlug(req.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-"));
        cat.setDescription(req.getDescription());
        cat.setImageUrl(req.getImageUrl());
        cat.setParentId(req.getParentId());
        cat.setNameRw(req.getNameRw());
        cat.setNameFr(req.getNameFr());
        cat.setIsActive(req.getIsActive() != null ? req.getIsActive() : true);
        return ResponseEntity.ok(categoryRepository.save(cat));
    }

    @DeleteMapping("/api/admin/categories/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        categoryRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Deleted"));
    }
}
