package com.ShopNova.ShopNova;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;
    private final VendorRepository vendorRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        // Always ensure admin exists regardless of whether products are seeded
        if (!userRepository.existsByEmail("pascalmuneza0@gmail.com")) {
            userRepository.save(User.builder()
                    .email("pascalmuneza0@gmail.com")
                    .password(passwordEncoder.encode("Muneza1@"))
                    .firstName("Pascal").lastName("Muneza")
                    .role("SUPER_ADMIN").isActive(true)
                    .emailVerified(true)
                    .build());
        }

        if (productRepository.count() > 0) return; // products already seeded

        // --- Vendor ---
        Vendor vendor = vendorRepository.save(Vendor.builder()
                .name("ShopNova Store").email("store@shopnova.com").phone("0790765114")
                .address("Kicukiro-Kanombe, Kigali").isActive(true).build());

        // --- Brands ---
        Brand apple   = brand("Apple",   "apple",   vendor);
        Brand samsung = brand("Samsung", "samsung", vendor);
        Brand nike    = brand("Nike",    "nike",    vendor);
        Brand sony    = brand("Sony",    "sony",    vendor);
        Brand ikea    = brand("IKEA",    "ikea",    vendor);
        Brand loreal  = brand("L'Oreal", "loreal",  vendor);

        // --- Categories ---
        Category electronics = category("Electronics",   "electronics",   null);
        Category fashion     = category("Fashion",       "fashion",       null);
        Category home        = category("Home & Living", "home-living",   null);
        Category sports      = category("Sports",        "sports",        null);
        Category beauty      = category("Beauty",        "beauty",        null);

        // Subcategories
        category("Phones",       "phones",      electronics.getId());
        category("Laptops",      "laptops",     electronics.getId());
        category("Audio",        "audio",       electronics.getId());
        category("Men's Wear",   "mens-wear",   fashion.getId());
        category("Women's Wear", "womens-wear", fashion.getId());
        category("Furniture",    "furniture",   home.getId());
        category("Footwear",     "footwear",    sports.getId());
        category("Skincare",     "skincare",    beauty.getId());

        // --- Products ---
        List.of(
            product("iPhone 15 Pro", "iphone-15-pro", "Latest Apple flagship with A17 Pro chip and titanium design.",
                    1199.99, 999.99, 50, "SKU-IP15P", electronics, apple, vendor,
                    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600", true),

            product("Samsung Galaxy S24", "samsung-galaxy-s24", "Android powerhouse with 200MP camera.",
                    899.99, 749.99, 80, "SKU-SGS24", electronics, samsung, vendor,
                    "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600", true),

            product("Sony WH-1000XM5", "sony-wh-1000xm5", "Industry-leading noise cancelling headphones.",
                    399.99, 279.99, 120, "SKU-SNWH5", electronics, sony, vendor,
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600", true),

            product("Nike Air Max 270", "nike-air-max-270", "Iconic Air Max cushioning for all-day comfort.",
                    150.00, 119.99, 200, "SKU-NAM270", sports, nike, vendor,
                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600", true),

            product("MacBook Pro 14\"", "macbook-pro-14", "M3 Pro chip, stunning Liquid Retina XDR display.",
                    1999.99, 1799.99, 30, "SKU-MBP14", electronics, apple, vendor,
                    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600", true),

            product("IKEA KALLAX Shelf", "ikea-kallax-shelf", "Versatile shelf unit for any room.",
                    79.99, null, 150, "SKU-IKKL", home, ikea, vendor,
                    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600", false),

            product("L'Oreal Revitalift Serum", "loreal-revitalift-serum", "Anti-aging serum with pure retinol.",
                    29.99, 22.99, 300, "SKU-LRRS", beauty, loreal, vendor,
                    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600", false),

            product("Nike Dri-FIT T-Shirt", "nike-dri-fit-tshirt", "Lightweight moisture-wicking training tee.",
                    35.00, 27.99, 500, "SKU-NDFT", fashion, nike, vendor,
                    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600", false),

            product("Samsung 4K Smart TV 55\"", "samsung-4k-tv-55", "Crystal UHD 4K display with smart features.",
                    699.99, 549.99, 40, "SKU-SS4KTV", electronics, samsung, vendor,
                    "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600", false),

            product("Sony PlayStation 5", "sony-ps5", "Next-gen gaming console with ultra-high speed SSD.",
                    499.99, null, 25, "SKU-SNPS5", electronics, sony, vendor,
                    "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=600", true)
        ).forEach(productRepository::save);

    }

    private Brand brand(String name, String slug, Vendor vendor) {
        return brandRepository.save(Brand.builder().name(name).slug(slug).isActive(true).build());
    }

    private Category category(String name, String slug, Long parentId) {
        return categoryRepository.save(Category.builder().name(name).slug(slug).parentId(parentId).isActive(true).build());
    }

    private Product product(String name, String slug, String desc,
                            double price, Double discountPrice, int stock, String sku,
                            Category category, Brand brand, Vendor vendor,
                            String imageUrl, boolean featured) {
        return Product.builder()
                .name(name).slug(slug).description(desc)
                .price(BigDecimal.valueOf(price))
                .discountPrice(discountPrice != null ? BigDecimal.valueOf(discountPrice) : null)
                .stockQuantity(stock).sku(sku)
                .category(category).brand(brand).vendor(vendor)
                .imageUrl(imageUrl).isFeatured(featured).isActive(true)
                .build();
    }
}
