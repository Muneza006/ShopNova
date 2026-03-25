-- Run this in your PostgreSQL database if you want to apply changes manually
-- Connect to shopnova_db database first

-- Add parent_id column to categories table
ALTER TABLE shopnova.categories ADD COLUMN IF NOT EXISTS parent_id BIGINT REFERENCES shopnova.categories(id) ON DELETE CASCADE;

-- Create index for parent_id
CREATE INDEX IF NOT EXISTS idx_categories_parent ON shopnova.categories(parent_id);

-- Insert subcategories for Electronics
INSERT INTO shopnova.categories (name, slug, description, parent_id, is_active) 
SELECT 'Smartphones', 'smartphones', 'Latest smartphones and mobile devices', id, true FROM shopnova.categories WHERE slug = 'electronics'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO shopnova.categories (name, slug, description, parent_id, is_active) 
SELECT 'Laptops', 'laptops', 'Laptops and notebooks', id, true FROM shopnova.categories WHERE slug = 'electronics'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO shopnova.categories (name, slug, description, parent_id, is_active) 
SELECT 'Tablets', 'tablets', 'iPads and tablets', id, true FROM shopnova.categories WHERE slug = 'electronics'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO shopnova.categories (name, slug, description, parent_id, is_active) 
SELECT 'Cameras', 'cameras', 'Digital cameras and accessories', id, true FROM shopnova.categories WHERE slug = 'electronics'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO shopnova.categories (name, slug, description, parent_id, is_active) 
SELECT 'Audio', 'audio', 'Headphones, speakers, and audio equipment', id, true FROM shopnova.categories WHERE slug = 'electronics'
ON CONFLICT (slug) DO NOTHING;

-- Insert subcategories for Fashion
INSERT INTO shopnova.categories (name, slug, description, parent_id, is_active) 
SELECT 'Men''s Clothing', 'mens-clothing', 'Clothing for men', id, true FROM shopnova.categories WHERE slug = 'fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO shopnova.categories (name, slug, description, parent_id, is_active) 
SELECT 'Women''s Clothing', 'womens-clothing', 'Clothing for women', id, true FROM shopnova.categories WHERE slug = 'fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO shopnova.categories (name, slug, description, parent_id, is_active) 
SELECT 'Shoes', 'shoes', 'Footwear for all', id, true FROM shopnova.categories WHERE slug = 'fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO shopnova.categories (name, slug, description, parent_id, is_active) 
SELECT 'Accessories', 'accessories', 'Fashion accessories', id, true FROM shopnova.categories WHERE slug = 'fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO shopnova.categories (name, slug, description, parent_id, is_active) 
SELECT 'Jewelry', 'jewelry', 'Jewelry and watches', id, true FROM shopnova.categories WHERE slug = 'fashion'
ON CONFLICT (slug) DO NOTHING;

-- Insert subcategories for Home & Living
INSERT INTO shopnova.categories (name, slug, description, parent_id, is_active) 
SELECT 'Furniture', 'furniture', 'Home furniture', id, true FROM shopnova.categories WHERE slug = 'home-living'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO shopnova.categories (name, slug, description, parent_id, is_active) 
SELECT 'Kitchen', 'kitchen', 'Kitchen appliances and tools', id, true FROM shopnova.categories WHERE slug = 'home-living'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO shopnova.categories (name, slug, description, parent_id, is_active) 
SELECT 'Bedding', 'bedding', 'Bedding and linens', id, true FROM shopnova.categories WHERE slug = 'home-living'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO shopnova.categories (name, slug, description, parent_id, is_active) 
SELECT 'Decor', 'decor', 'Home decoration items', id, true FROM shopnova.categories WHERE slug = 'home-living'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO shopnova.categories (name, slug, description, parent_id, is_active) 
SELECT 'Lighting', 'lighting', 'Lamps and lighting fixtures', id, true FROM shopnova.categories WHERE slug = 'home-living'
ON CONFLICT (slug) DO NOTHING;

-- Insert subcategories for Sports & Outdoors
INSERT INTO shopnova.categories (name, slug, description, parent_id, is_active) 
SELECT 'Fitness Equipment', 'fitness-equipment', 'Gym and fitness gear', id, true FROM shopnova.categories WHERE slug = 'sports-outdoors'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO shopnova.categories (name, slug, description, parent_id, is_active) 
SELECT 'Outdoor Gear', 'outdoor-gear', 'Camping and hiking equipment', id, true FROM shopnova.categories WHERE slug = 'sports-outdoors'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO shopnova.categories (name, slug, description, parent_id, is_active) 
SELECT 'Sports Apparel', 'sports-apparel', 'Athletic clothing', id, true FROM shopnova.categories WHERE slug = 'sports-outdoors'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO shopnova.categories (name, slug, description, parent_id, is_active) 
SELECT 'Cycling', 'cycling', 'Bikes and cycling accessories', id, true FROM shopnova.categories WHERE slug = 'sports-outdoors'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO shopnova.categories (name, slug, description, parent_id, is_active) 
SELECT 'Water Sports', 'water-sports', 'Swimming and water sports gear', id, true FROM shopnova.categories WHERE slug = 'sports-outdoors'
ON CONFLICT (slug) DO NOTHING;

-- Insert subcategories for Beauty & Health
INSERT INTO shopnova.categories (name, slug, description, parent_id, is_active) 
SELECT 'Skincare', 'skincare', 'Skincare products', id, true FROM shopnova.categories WHERE slug = 'beauty-health'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO shopnova.categories (name, slug, description, parent_id, is_active) 
SELECT 'Makeup', 'makeup', 'Cosmetics and makeup', id, true FROM shopnova.categories WHERE slug = 'beauty-health'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO shopnova.categories (name, slug, description, parent_id, is_active) 
SELECT 'Haircare', 'haircare', 'Hair products and tools', id, true FROM shopnova.categories WHERE slug = 'beauty-health'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO shopnova.categories (name, slug, description, parent_id, is_active) 
SELECT 'Fragrances', 'fragrances', 'Perfumes and colognes', id, true FROM shopnova.categories WHERE slug = 'beauty-health'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO shopnova.categories (name, slug, description, parent_id, is_active) 
SELECT 'Wellness', 'wellness', 'Health and wellness products', id, true FROM shopnova.categories WHERE slug = 'beauty-health'
ON CONFLICT (slug) DO NOTHING;

-- Insert subcategories for Books & Media
INSERT INTO shopnova.categories (name, slug, description, parent_id, is_active) 
SELECT 'Fiction', 'fiction', 'Fiction books', id, true FROM shopnova.categories WHERE slug = 'books-media'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO shopnova.categories (name, slug, description, parent_id, is_active) 
SELECT 'Non-Fiction', 'non-fiction', 'Non-fiction books', id, true FROM shopnova.categories WHERE slug = 'books-media'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO shopnova.categories (name, slug, description, parent_id, is_active) 
SELECT 'Movies', 'movies', 'DVDs and Blu-rays', id, true FROM shopnova.categories WHERE slug = 'books-media'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO shopnova.categories (name, slug, description, parent_id, is_active) 
SELECT 'Music', 'music', 'CDs and vinyl records', id, true FROM shopnova.categories WHERE slug = 'books-media'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO shopnova.categories (name, slug, description, parent_id, is_active) 
SELECT 'Games', 'games', 'Video games and board games', id, true FROM shopnova.categories WHERE slug = 'books-media'
ON CONFLICT (slug) DO NOTHING;
