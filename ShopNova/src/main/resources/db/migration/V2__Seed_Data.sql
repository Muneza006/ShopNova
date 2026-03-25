-- Insert Super Admin and Backup Admin (password: Admin@123)
INSERT INTO admins (email, password, full_name, role) VALUES
('superadmin@shopnova.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Super Admin', 'SUPER_ADMIN'),
('backupadmin@shopnova.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Backup Admin', 'BACKUP_ADMIN');

-- Insert Categories
INSERT INTO categories (name, slug, description, image_url) VALUES
('Electronics', 'electronics', 'Latest gadgets and electronic devices', 'https://images.unsplash.com/photo-1498049794561-7780e7231661'),
('Fashion', 'fashion', 'Trendy clothing and accessories', 'https://images.unsplash.com/photo-1445205170230-053b83016050'),
('Home & Living', 'home-living', 'Furniture and home decor', 'https://images.unsplash.com/photo-1484101403633-562f891dc89a'),
('Sports & Outdoors', 'sports-outdoors', 'Sports equipment and outdoor gear', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211'),
('Beauty & Health', 'beauty-health', 'Skincare and wellness products', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348'),
('Books & Media', 'books-media', 'Books, movies, and music', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d');

-- Insert Brands
INSERT INTO brands (name, slug, logo_url) VALUES
('TechPro', 'techpro', 'https://via.placeholder.com/150x50/4F46E5/FFFFFF?text=TechPro'),
('StyleHub', 'stylehub', 'https://via.placeholder.com/150x50/EC4899/FFFFFF?text=StyleHub'),
('HomeComfort', 'homecomfort', 'https://via.placeholder.com/150x50/10B981/FFFFFF?text=HomeComfort'),
('ActiveLife', 'activelife', 'https://via.placeholder.com/150x50/F59E0B/FFFFFF?text=ActiveLife'),
('PureGlow', 'pureglow', 'https://via.placeholder.com/150x50/8B5CF6/FFFFFF?text=PureGlow'),
('ReadMore', 'readmore', 'https://via.placeholder.com/150x50/EF4444/FFFFFF?text=ReadMore');

-- Insert Sample Vendors
INSERT INTO vendors (name, email, phone, address) VALUES
('Global Tech Supplies', 'contact@globaltechsupplies.com', '+1-555-0101', '123 Tech Street, Silicon Valley, CA'),
('Fashion Wholesale Co', 'info@fashionwholesale.com', '+1-555-0102', '456 Fashion Ave, New York, NY'),
('Home Essentials Ltd', 'sales@homeessentials.com', '+1-555-0103', '789 Home Blvd, Austin, TX');
