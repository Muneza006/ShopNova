# ShopNova Setup Instructions

## Backend Setup Complete ✓

The Spring Boot backend has been configured with:
- Database schema with 14 tables (Flyway migrations)
- Core entities: Product, Category, Brand, Vendor
- REST API controllers for products and categories
- Security configuration
- Application properties with PostgreSQL connection

## Next Steps to Complete Setup

### 1. Create PostgreSQL Database
Open pgAdmin 4 and run:
```sql
CREATE DATABASE shopnova_db WITH OWNER postgres ENCODING 'UTF8';
CREATE USER shopnova_user WITH PASSWORD 'shopnova_pass';
GRANT ALL PRIVILEGES ON DATABASE shopnova_db TO shopnova_user;
\c shopnova_db
CREATE SCHEMA shopnova;
GRANT ALL ON SCHEMA shopnova TO shopnova_user;
```

### 2. Start Spring Boot Backend
```bash
cd "c:\Users\pc\OneDrive\Documents\Courses\Final Year 2026\ShopNova\ShopNova"
mvnw spring-boot:run
```

The backend will run on http://localhost:8080
Flyway will automatically create all tables and seed initial data.

### 3. Create React Frontend
```bash
cd "c:\Users\pc\OneDrive\Documents\Courses\Final Year 2026\ShopNova"
npm create vite@latest shopnova-frontend -- --template react
cd shopnova-frontend
npm install
npm install axios react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 4. Configure Tailwind CSS
Edit `tailwind.config.js`:
```js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Edit `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 5. Test API Endpoints
Once backend is running, test in browser or Postman:
- GET http://localhost:8080/api/categories
- GET http://localhost:8080/api/products
- GET http://localhost:8080/api/products/featured

### 6. Admin Credentials
- Super Admin: superadmin@shopnova.com / Admin@123
- Backup Admin: backupadmin@shopnova.com / Admin@123

## Project Structure Created

Backend (Spring Boot):
- ✓ Entities: Product, Category, Brand, Vendor
- ✓ Repositories: ProductRepository, CategoryRepository
- ✓ Services: ProductService
- ✓ Controllers: ProductController, CategoryController
- ✓ Security: SecurityConfig (currently open for development)
- ✓ Database: 14 tables with seed data

## VS Code Extensions to Install

Java & Spring Boot:
1. Extension Pack for Java (Microsoft)
2. Spring Boot Extension Pack (VMware)
3. Spring Boot Dashboard (Microsoft)
4. Lombok Annotations Support (Microsoft)
5. Maven for Java (Microsoft)

React & Frontend:
1. ES7+ React/Redux/React-Native snippets (dsznajder)
2. Prettier - Code formatter (Prettier)
3. ESLint (Microsoft)
4. Auto Import (steoates)
5. Tailwind CSS IntelliSense (Tailwind Labs)

Database:
1. PostgreSQL (Chris Kolkman)
2. Database Client (Weijan Chen)

General:
1. GitLens (GitKraken)
2. Thunder Client
3. Path Intellisense
4. Error Lens
5. Material Icon Theme

## Ready to Build Frontend

Once you complete steps 1-4 above, I can help you build:
- Modern homepage with hero section
- Product catalog with filters
- Product detail pages
- Shopping cart
- Checkout flow
- Admin dashboard
- User authentication

The backend is ready and waiting for the frontend!
