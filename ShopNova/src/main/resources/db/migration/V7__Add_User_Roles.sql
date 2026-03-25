ALTER TABLE shopnova.users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'CUSTOMER';

-- Update existing admin accounts
UPDATE shopnova.users SET role = 'SUPER_ADMIN' WHERE email = 'superadmin@shopnova.com';
UPDATE shopnova.users SET role = 'BACKUP_ADMIN' WHERE email = 'backupadmin@shopnova.com';
