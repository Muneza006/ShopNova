-- Add Toys & Games main category
INSERT INTO shopnova.categories (name, slug, description, image_url)
VALUES ('Toys & Games', 'toys-games', 'Fun toys and games for children of all ages', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64');

-- Add Toys brand
INSERT INTO shopnova.brands (name, slug, logo_url)
VALUES ('KidZone', 'kidzone', 'https://via.placeholder.com/150x50/F59E0B/FFFFFF?text=KidZone');

-- Add Toys subcategories (parent_id = id of Toys & Games category)
INSERT INTO shopnova.categories (name, slug, description, image_url, parent_id)
VALUES
('Action Figures',   'action-figures',   'Superhero and character action figures',     'https://images.unsplash.com/photo-1608889175123-8ee362201f81', (SELECT id FROM shopnova.categories WHERE slug = 'toys-games')),
('Board Games',      'board-games',      'Family and strategy board games',             'https://images.unsplash.com/photo-1611996575749-79a3a250f948', (SELECT id FROM shopnova.categories WHERE slug = 'toys-games')),
('Educational Toys', 'educational-toys', 'Learning toys for kids',                      'https://images.unsplash.com/photo-1587654780291-39c9404d746b', (SELECT id FROM shopnova.categories WHERE slug = 'toys-games')),
('Outdoor Toys',     'outdoor-toys',     'Bikes, balls and outdoor play equipment',     'https://images.unsplash.com/photo-1575783970733-1aaedde1db74', (SELECT id FROM shopnova.categories WHERE slug = 'toys-games')),
('Stuffed Animals',  'stuffed-animals',  'Soft plush toys and stuffed animals',         'https://images.unsplash.com/photo-1559454403-b8fb88521f11', (SELECT id FROM shopnova.categories WHERE slug = 'toys-games'));

-- Add default Toy products
INSERT INTO shopnova.products (name, slug, description, price, discount_price, stock_quantity, sku, category_id, brand_id, vendor_id, image_url, is_featured, is_active)
VALUES
(
  'Superhero Action Figure Set',
  'superhero-action-figure-set',
  'Set of 6 superhero action figures with accessories. Perfect for kids aged 4 and above. Made from durable, non-toxic materials.',
  24.99, 19.99, 150, 'TOY-AF-001',
  (SELECT id FROM shopnova.categories WHERE slug = 'action-figures'),
  (SELECT id FROM shopnova.brands WHERE slug = 'kidzone'),
  1,
  'https://images.unsplash.com/photo-1608889175123-8ee362201f81',
  true, true
),
(
  'Classic Family Board Game',
  'classic-family-board-game',
  'Fun strategy board game for the whole family. Supports 2-6 players. Recommended for ages 6 and up.',
  29.99, null, 80, 'TOY-BG-001',
  (SELECT id FROM shopnova.categories WHERE slug = 'board-games'),
  (SELECT id FROM shopnova.brands WHERE slug = 'kidzone'),
  1,
  'https://images.unsplash.com/photo-1611996575749-79a3a250f948',
  false, true
),
(
  'Building Blocks Set 100pcs',
  'building-blocks-set-100pcs',
  'Colorful 100-piece building blocks that develop creativity and motor skills. Safe for children aged 3 and above.',
  34.99, 27.99, 200, 'TOY-ED-001',
  (SELECT id FROM shopnova.categories WHERE slug = 'educational-toys'),
  (SELECT id FROM shopnova.brands WHERE slug = 'kidzone'),
  1,
  'https://images.unsplash.com/photo-1587654780291-39c9404d746b',
  true, true
),
(
  'Kids Balance Bike',
  'kids-balance-bike',
  'Lightweight balance bike for toddlers aged 2-5. Helps develop balance and coordination. Adjustable seat height.',
  59.99, 49.99, 60, 'TOY-OT-001',
  (SELECT id FROM shopnova.categories WHERE slug = 'outdoor-toys'),
  (SELECT id FROM shopnova.brands WHERE slug = 'kidzone'),
  1,
  'https://images.unsplash.com/photo-1575783970733-1aaedde1db74',
  true, true
),
(
  'Giant Teddy Bear',
  'giant-teddy-bear',
  'Super soft and huggable giant teddy bear. Made from premium plush material. Perfect gift for kids of all ages.',
  44.99, 34.99, 100, 'TOY-SA-001',
  (SELECT id FROM shopnova.categories WHERE slug = 'stuffed-animals'),
  (SELECT id FROM shopnova.brands WHERE slug = 'kidzone'),
  1,
  'https://images.unsplash.com/photo-1559454403-b8fb88521f11',
  false, true
),
(
  'Remote Control Racing Car',
  'remote-control-racing-car',
  'High-speed RC racing car with 2.4GHz remote control. Reaches speeds up to 30km/h. Rechargeable battery included.',
  49.99, 39.99, 75, 'TOY-RC-001',
  (SELECT id FROM shopnova.categories WHERE slug = 'toys-games'),
  (SELECT id FROM shopnova.brands WHERE slug = 'kidzone'),
  1,
  'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65',
  true, true
),
(
  'Kids Art & Craft Kit',
  'kids-art-craft-kit',
  'Complete art kit with crayons, paints, brushes, and drawing paper. Encourages creativity in children aged 4-12.',
  19.99, null, 120, 'TOY-AK-001',
  (SELECT id FROM shopnova.categories WHERE slug = 'educational-toys'),
  (SELECT id FROM shopnova.brands WHERE slug = 'kidzone'),
  1,
  'https://images.unsplash.com/photo-1513364776144-60967b0f800f',
  false, true
),
(
  'Wooden Puzzle Set',
  'wooden-puzzle-set',
  'Set of 3 colorful wooden puzzles with animals, numbers and shapes. Develops problem-solving skills for ages 2-5.',
  22.99, 17.99, 90, 'TOY-WP-001',
  (SELECT id FROM shopnova.categories WHERE slug = 'educational-toys'),
  (SELECT id FROM shopnova.brands WHERE slug = 'kidzone'),
  1,
  'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5',
  false, true
);
