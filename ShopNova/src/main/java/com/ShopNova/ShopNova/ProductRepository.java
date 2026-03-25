package com.ShopNova.ShopNova;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySlug(String slug);
    List<Product> findByIsActiveTrue();
    List<Product> findByIsFeaturedTrue();
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findByCategoryIdIn(List<Long> categoryIds);
    List<Product> findByBrandId(Long brandId);

    @Query("SELECT p FROM Product p WHERE p.isActive = true AND (" +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(p.brand.name) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(p.category.name) LIKE LOWER(CONCAT('%', :q, '%')))")
    List<Product> search(@Param("q") String q);
}
