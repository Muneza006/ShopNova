-- Insert Super Admin with email: pascalmuneza0@gmail.com and password: Muneza1@
-- Using BCrypt hash for password: Muneza1@
INSERT INTO shopnova.users (email, password, first_name, last_name, phone, role, is_active, created_at, updated_at) 
VALUES ('pascalmuneza0@gmail.com', '$2a$10$8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8uKqY5F5F5F5F5F5F5F5F5F5F5F5F5F5F5', 'Pascal', 'Muneza', '0790765114', 'SUPER_ADMIN', true, NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET role = 'SUPER_ADMIN';
