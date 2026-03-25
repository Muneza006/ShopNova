-- First check your category slugs (run this first to confirm)
SELECT id, name, slug FROM categories WHERE parent_id IS NULL;

-- Then run the inserts below
-- Electronics subcategories
INSERT INTO categories (name, slug, description, parent_id, is_active)
SELECT 'Smartphones', 'smartphones', 'Latest smartphones and mobile phones', id, true FROM categories WHERE name = 'Electronics' AND parent_id IS NULL ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, parent_id, is_active)
SELECT 'Laptops', 'laptops', 'Laptops and notebooks', id, true FROM categories WHERE name = 'Electronics' AND parent_id IS NULL ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, parent_id, is_active)
SELECT 'Tablets', 'tablets', 'iPads and Android tablets', id, true FROM categories WHERE name = 'Electronics' AND parent_id IS NULL ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, parent_id, is_active)
SELECT 'Audio', 'audio', 'Headphones, speakers and audio gear', id, true FROM categories WHERE name = 'Electronics' AND parent_id IS NULL ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, parent_id, is_active)
SELECT 'Cameras', 'cameras', 'Digital cameras and accessories', id, true FROM categories WHERE name = 'Electronics' AND parent_id IS NULL ON CONFLICT (slug) DO NOTHING;

-- Fashion subcategories
INSERT INTO categories (name, slug, description, parent_id, is_active)
SELECT 'Men''s Clothing', 'mens-clothing', 'Clothing for men', id, true FROM categories WHERE name = 'Fashion' AND parent_id IS NULL ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, parent_id, is_active)
SELECT 'Women''s Clothing', 'womens-clothing', 'Clothing for women', id, true FROM categories WHERE name = 'Fashion' AND parent_id IS NULL ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, parent_id, is_active)
SELECT 'Shoes', 'shoes', 'Footwear for all', id, true FROM categories WHERE name = 'Fashion' AND parent_id IS NULL ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, parent_id, is_active)
SELECT 'Accessories', 'accessories', 'Bags, belts and fashion accessories', id, true FROM categories WHERE name = 'Fashion' AND parent_id IS NULL ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, parent_id, is_active)
SELECT 'Jewelry', 'jewelry', 'Jewelry and watches', id, true FROM categories WHERE name = 'Fashion' AND parent_id IS NULL ON CONFLICT (slug) DO NOTHING;

-- Home & Living subcategories
INSERT INTO categories (name, slug, description, parent_id, is_active)
SELECT 'Furniture', 'furniture', 'Home furniture', id, true FROM categories WHERE name = 'Home & Living' AND parent_id IS NULL ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, parent_id, is_active)
SELECT 'Kitchen', 'kitchen', 'Kitchen appliances and tools', id, true FROM categories WHERE name = 'Home & Living' AND parent_id IS NULL ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, parent_id, is_active)
SELECT 'Bedding', 'bedding', 'Bedding and linens', id, true FROM categories WHERE name = 'Home & Living' AND parent_id IS NULL ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, parent_id, is_active)
SELECT 'Decor', 'decor', 'Home decoration items', id, true FROM categories WHERE name = 'Home & Living' AND parent_id IS NULL ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, parent_id, is_active)
SELECT 'Lighting', 'lighting', 'Lamps and lighting fixtures', id, true FROM categories WHERE name = 'Home & Living' AND parent_id IS NULL ON CONFLICT (slug) DO NOTHING;

-- Sports subcategories
INSERT INTO categories (name, slug, description, parent_id, is_active)
SELECT 'Fitness Equipment', 'fitness-equipment', 'Gym and fitness gear', id, true FROM categories WHERE name = 'Sports' AND parent_id IS NULL ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, parent_id, is_active)
SELECT 'Outdoor Gear', 'outdoor-gear', 'Camping and hiking equipment', id, true FROM categories WHERE name = 'Sports' AND parent_id IS NULL ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, parent_id, is_active)
SELECT 'Sports Apparel', 'sports-apparel', 'Athletic clothing and footwear', id, true FROM categories WHERE name = 'Sports' AND parent_id IS NULL ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, parent_id, is_active)
SELECT 'Cycling', 'cycling', 'Bikes and cycling accessories', id, true FROM categories WHERE name = 'Sports' AND parent_id IS NULL ON CONFLICT (slug) DO NOTHING;

-- Beauty subcategories
INSERT INTO categories (name, slug, description, parent_id, is_active)
SELECT 'Skincare', 'skincare', 'Skincare products', id, true FROM categories WHERE name = 'Beauty' AND parent_id IS NULL ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, parent_id, is_active)
SELECT 'Makeup', 'makeup', 'Cosmetics and makeup', id, true FROM categories WHERE name = 'Beauty' AND parent_id IS NULL ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, parent_id, is_active)
SELECT 'Haircare', 'haircare', 'Hair products and tools', id, true FROM categories WHERE name = 'Beauty' AND parent_id IS NULL ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, parent_id, is_active)
SELECT 'Fragrances', 'fragrances', 'Perfumes and colognes', id, true FROM categories WHERE name = 'Beauty' AND parent_id IS NULL ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, parent_id, is_active)
SELECT 'Wellness', 'wellness', 'Health and wellness products', id, true FROM categories WHERE name = 'Beauty' AND parent_id IS NULL ON CONFLICT (slug) DO NOTHING;
