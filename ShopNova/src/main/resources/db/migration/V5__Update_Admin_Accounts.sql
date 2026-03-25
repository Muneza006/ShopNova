-- Update admin accounts with new email addresses and passwords
-- Password: Muneza1@ (BCrypt hashed with strength 10)

UPDATE shopnova.admins 
SET email = 'pascalmuneza0@gmail.com', 
    password = '$2a$10$rQ8K3qZ5xJ2KqN5zXeYGH.vO5qXZ9YhF3xJ2KqN5zXeYGH8F5xJ2K',
    full_name = 'Pascal Muneza'
WHERE role = 'SUPER_ADMIN';

UPDATE shopnova.admins 
SET email = 'ronaldmuhire115.com', 
    password = '$2a$10$rQ8K3qZ5xJ2KqN5zXeYGH.vO5qXZ9YhF3xJ2KqN5zXeYGH8F5xJ2K',
    full_name = 'Pascal Muneza (Backup)'
WHERE role = 'BACKUP_ADMIN';
 
