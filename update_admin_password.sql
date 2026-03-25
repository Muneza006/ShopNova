-- Copy the password hash from your working account (id=1) to the super admin account
UPDATE shopnova.users 
SET password = (SELECT password FROM shopnova.users WHERE id = 1)
WHERE email = 'pascalmuneza0@gmail.com';
