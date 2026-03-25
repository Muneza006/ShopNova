-- Run this SQL directly in your PostgreSQL database
-- This creates a super admin account with email: pascalmuneza0@gmail.com and password: Muneza1@

INSERT INTO shopnova.users (email, password, first_name, last_name, phone, role, is_active, created_at, updated_at) 
VALUES (
    'pascalmuneza0@gmail.com', 
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 
    'Pascal', 
    'Muneza', 
    '0790765114', 
    'SUPER_ADMIN', 
    true, 
    NOW(), 
    NOW()
);
