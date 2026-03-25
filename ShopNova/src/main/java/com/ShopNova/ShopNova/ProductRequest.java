package com.ShopNova.ShopNova;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductRequest {
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private Integer stockQuantity;
    private String sku;
    private String imageUrl;
    private Boolean isFeatured;
    private Long categoryId;
    private Long brandId;
}
