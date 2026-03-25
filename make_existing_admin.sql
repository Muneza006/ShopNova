-- Make your working account (pmuneza0@gmail.com) a SUPER_ADMIN
UPDATE shopnova.users 
SET role = 'SUPER_ADMIN'
WHERE email = 'pmuneza0@gmail.com';
