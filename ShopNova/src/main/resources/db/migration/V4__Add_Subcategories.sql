-- Add parent_id to categories table for subcategory support
ALTER TABLE categories ADD COLUMN parent_id BIGINT REFERENCES categories(id) ON DELETE CASCADE;

-- Create index for parent_id
CREATE INDEX idx_categories_parent ON categories(parent_id);

-- Insert subcategories for Electronics
INSERT INTO categories (name, slug, description, parent_id, is_active) VALUES
('Smartphones', 'smartphones', 'Latest smartphones and mobile devices', (SELECT id FROM categories WHERE slug = 'electronics'), true),
('Laptops', 'laptops', 'Laptops and notebooks', (SELECT id FROM categories WHERE slug = 'electronics'), true),
('Tablets', 'tablets', 'iPads and tablets', (SELECT id FROM categories WHERE slug = 'electronics'), true),
('Cameras', 'cameras', 'Digital cameras and accessories', (SELECT id FROM categories WHERE slug = 'electronics'), true),
('Audio', 'audio', 'Headphones, speakers, and audio equipment', (SELECT id FROM categories WHERE slug = 'electronics'), true);

-- Insert subcategories for Fashion
INSERT INTO categories (name, slug, description, parent_id, is_active) VALUES
('Men''s Clothing', 'mens-clothing', 'Clothing for men', (SELECT id FROM categories WHERE slug = 'fashion'), true),
('Women''s Clothing', 'womens-clothing', 'Clothing for women', (SELECT id FROM categories WHERE slug = 'fashion'), true),
('Shoes', 'shoes', 'Footwear for all', (SELECT id FROM categories WHERE slug = 'fashion'), true),
('Accessories', 'accessories', 'Fashion accessories', (SELECT id FROM categories WHERE slug = 'fashion'), true),
('Jewelry', 'jewelry', 'Jewelry and watches', (SELECT id FROM categories WHERE slug = 'fashion'), true);

-- Insert subcategories for Home & Living
INSERT INTO categories (name, slug, description, parent_id, is_active) VALUES
('Furniture', 'furniture', 'Home furniture', (SELECT id FROM categories WHERE slug = 'home-living'), true),
('Kitchen', 'kitchen', 'Kitchen appliances and tools', (SELECT id FROM categories WHERE slug = 'home-living'), true),
('Bedding', 'bedding', 'Bedding and linens', (SELECT id FROM categories WHERE slug = 'home-living'), true),
('Decor', 'decor', 'Home decoration items', (SELECT id FROM categories WHERE slug = 'home-living'), true),
('Lighting', 'lighting', 'Lamps and lighting fixtures', (SELECT id FROM categories WHERE slug = 'home-living'), true);

-- Insert subcategories for Sports & Outdoors
INSERT INTO categories (name, slug, description, parent_id, is_active) VALUES
('Fitness Equipment', 'fitness-equipment', 'Gym and fitness gear', (SELECT id FROM categories WHERE slug = 'sports-outdoors'), true),
('Outdoor Gear', 'outdoor-gear', 'Camping and hiking equipment', (SELECT id FROM categories WHERE slug = 'sports-outdoors'), true),
('Sports Apparel', 'sports-apparel', 'Athletic clothing', (SELECT id FROM categories WHERE slug = 'sports-outdoors'), true),
('Cycling', 'cycling', 'Bikes and cycling accessories', (SELECT id FROM categories WHERE slug = 'sports-outdoors'), true),
('Water Sports', 'water-sports', 'Swimming and water sports gear', (SELECT id FROM categories WHERE slug = 'sports-outdoors'), true);

-- Insert subcategories for Beauty & Health
INSERT INTO categories (name, slug, description, parent_id, is_active) VALUES
('Skincare', 'skincare', 'Skincare products', (SELECT id FROM categories WHERE slug = 'beauty-health'), true),
('Makeup', 'makeup', 'Cosmetics and makeup', (SELECT id FROM categories WHERE slug = 'beauty-health'), true),
('Haircare', 'haircare', 'Hair products and tools', (SELECT id FROM categories WHERE slug = 'beauty-health'), true),
('Fragrances', 'fragrances', 'Perfumes and colognes', (SELECT id FROM categories WHERE slug = 'beauty-health'), true),
('Wellness', 'wellness', 'Health and wellness products', (SELECT id FROM categories WHERE slug = 'beauty-health'), true);

-- Insert subcategories for Books & Media
INSERT INTO categories (name, slug, description, parent_id, is_active) VALUES
('Fiction', 'fiction', 'Fiction books', (SELECT id FROM categories WHERE slug = 'books-media'), true),
('Non-Fiction', 'non-fiction', 'Non-fiction books', (SELECT id FROM categories WHERE slug = 'books-media'), true),
('Movies', 'movies', 'DVDs and Blu-rays', (SELECT id FROM categories WHERE slug = 'books-media'), true),
('Music', 'music', 'CDs and vinyl records', (SELECT id FROM categories WHERE slug = 'books-media'), true),
('Games', 'games', 'Video games and board games', (SELECT id FROM categories WHERE slug = 'books-media'), true);
