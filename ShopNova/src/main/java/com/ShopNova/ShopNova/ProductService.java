package com.ShopNova.ShopNova;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getAllActiveProducts() {
        return productRepository.findByIsActiveTrue();
    }

    public List<Product> getFeaturedProducts() {
        return productRepository.findByIsFeaturedTrue();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public Product getProductBySlug(String slug) {
        return productRepository.findBySlug(slug)
            .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        // Get products in this category AND all its subcategories
        List<Long> ids = new java.util.ArrayList<>();
        ids.add(categoryId);
        categoryRepository.findByParentIdAndIsActiveTrue(categoryId)
            .forEach(sub -> ids.add(sub.getId()));
        return productRepository.findByCategoryIdIn(ids);
    }

    public List<Product> searchProducts(String q) {
        if (q == null || q.isBlank()) return getAllActiveProducts();
        return productRepository.search(q.trim());
    }

    @Transactional
    public Product createProduct(ProductRequest req) {
        String slug = req.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-") + "-" + System.currentTimeMillis();
        String sku = (req.getSku() != null && !req.getSku().isBlank())
            ? req.getSku()
            : "SKU-" + System.currentTimeMillis() + "-" + (int)(Math.random() * 9000 + 1000);
        Product product = Product.builder()
            .name(req.getName())
            .slug(slug)
            .description(req.getDescription())
            .price(req.getPrice())
            .discountPrice(req.getDiscountPrice())
            .stockQuantity(req.getStockQuantity() != null ? req.getStockQuantity() : 0)
            .sku(sku)
            .imageUrl(req.getImageUrl())
            .isFeatured(req.getIsFeatured() != null ? req.getIsFeatured() : false)
            .isActive(true)
            .category(req.getCategoryId() != null ? categoryRepository.findById(req.getCategoryId()).orElse(null) : null)
            .brand(req.getBrandId() != null ? brandRepository.findById(req.getBrandId()).orElse(null) : null)
            .build();
        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(Long id, ProductRequest req) {
        Product product = getProductById(id);
        if (req.getName() != null) product.setName(req.getName());
        if (req.getDescription() != null) product.setDescription(req.getDescription());
        if (req.getPrice() != null) product.setPrice(req.getPrice());
        if (req.getDiscountPrice() != null) product.setDiscountPrice(req.getDiscountPrice());
        if (req.getStockQuantity() != null) product.setStockQuantity(req.getStockQuantity());
        if (req.getImageUrl() != null) product.setImageUrl(req.getImageUrl());
        if (req.getIsFeatured() != null) product.setIsFeatured(req.getIsFeatured());
        if (req.getCategoryId() != null) product.setCategory(categoryRepository.findById(req.getCategoryId()).orElse(null));
        if (req.getBrandId() != null) product.setBrand(brandRepository.findById(req.getBrandId()).orElse(null));
        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
