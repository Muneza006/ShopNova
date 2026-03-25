package com.ShopNova.ShopNova;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryWithSubcategoriesDTO {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String imageUrl;
    private List<Category> subcategories;
}
