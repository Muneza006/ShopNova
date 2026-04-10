# ShopNova — E-Commerce Platform

A full-stack e-commerce platform built for Rwanda, featuring a Spring Boot backend and React frontend.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 3.5, Spring Security, JPA/Hibernate |
| Database | PostgreSQL |
| Frontend | React 18, Vite, Tailwind CSS |
| Auth | JWT, Google OAuth2, QR Code Login |
| Payments | MTN MoMo API (sandbox + production ready) |
| Email | Gmail SMTP (Spring Mail) |

---

## Project Structure

```
ShopNova/
├── ShopNova/                  # Spring Boot backend
│   └── src/main/java/...      # Java source files
│   └── src/main/resources/    # application.yaml, DB migrations
└── shopnova-frontend/         # React frontend
    └── src/
        ├── components/        # Reusable UI components
        ├── pages/             # Page components
        ├── context/           # Language context
        ├── services/          # API service
        └── utils/             # Helpers, validators, constants
```

---

## Features

### Authentication
- Email/password login with email verification
- Google OAuth2 login
- QR Code login — scan with a logged-in device to sign in on desktop
- Blocked user check on both password and Google login
- JWT tokens with 24-hour expiry
- Forgot password / reset password via email link

### Customer Features
- Browse products organized by category with auto-scrolling sliders
- Manual drag/swipe + arrow buttons on product sliders
- Product detail page with zoom, image thumbnails
- Add to cart, wishlist
- Checkout with Rwanda address selector (Province → District → Sector)
- Cash on Delivery and MTN MoMo payment
- MoMo push payment — payment prompt sent directly to customer's phone
- Real-time MoMo payment status polling
- Customer dashboard — orders, wishlist, profile
- Multi-language support: English, Kinyarwanda, French

### Admin Dashboard
- Overview with today's stats (sales, orders, new users, stock alerts)
- Sales line chart and orders bar chart (last 7 days)
- Top selling products, low stock alerts, recent activity feed
- Products management — add, edit, delete, search, filter by category
- Image upload from computer or URL
- Orders management — clickable rows open order details modal, status filter, inline status update
- Users management — avatar, role badges, toggle switch for block/activate, protected self-account
- Categories management — product count per category, add/edit modal
- Notifications bell showing pending orders count

### Product Organization
- Homepage: hero banner with auto-slider, trust badges, flash deals, products grouped by category
- Each category section has a colored header and auto-scrolling product row
- Customer reviews slider at the bottom of homepage
- Products page: same category-based layout with colored sections

### Technical Features
- `@Builder.Default` fixes across all Lombok entities (User, Product, Brand, Vendor)
- Global exception handler returning readable error messages
- File upload endpoint — images saved to `uploads/` folder, served as static resources
- QR login controller with in-memory session management (5-minute expiry)
- Network sharing support — configurable `VITE_API_URL` env variable
- CORS configured for local network and ngrok

---

## Setup & Running

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL
- Maven

### Database
Create a PostgreSQL database:
```sql
CREATE DATABASE shopnova_db;
```

### Backend
```bash
cd ShopNova
mvn spring-boot:run
```
Runs on `http://localhost:8080`

### Frontend
```bash
cd shopnova-frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`

---

## Configuration

Edit `ShopNova/src/main/resources/application.yaml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/shopnova_db
    username: your_db_username
    password: your_db_password

  security:
    oauth2:
      client:
        registration:
          google:
            client-id: YOUR_GOOGLE_CLIENT_ID
            client-secret: YOUR_GOOGLE_CLIENT_SECRET

  mail:
    username: your_gmail@gmail.com
    password: your_app_password   # Gmail App Password

momo:
  base-url: https://sandbox.momodeveloper.mtn.com
  primary-key: YOUR_MOMO_PRIMARY_KEY
  environment: sandbox   # change to 'live' for production
  currency: EUR          # change to 'RWF' for production
```

---

## Admin Accounts

| Role | Email | Default Password |
|------|-------|-----------------|
| Super Admin | pascalmuneza0@gmail.com | Muneza1@ |
| Backup Admin | ronaldmuhire115@gmail.com | Muneza1@ |

To create/update admin roles directly in the database:
```sql
UPDATE users SET role = 'SUPER_ADMIN' WHERE email = 'your@email.com';
```

---

## MTN MoMo Integration

The platform uses the MTN MoMo Collections API to push payment requests directly to customers' phones.

**Flow:**
1. Customer selects Mobile Money at checkout and enters their MTN number
2. Backend creates a MoMo API user, gets an access token, and calls `requestToPay`
3. Customer receives a payment prompt on their phone
4. Customer approves in their MoMo app
5. Frontend polls `/api/orders/{id}/momo-status` every 10 seconds
6. Order is automatically marked as PAID when payment is confirmed

**To go live:** Register at [momodeveloper.mtn.com](https://momodeveloper.mtn.com), get production keys, and update `application.yaml`.

---

## QR Code Login

Allows a logged-in device (phone) to authenticate a desktop session by scanning a QR code.

**Flow:**
1. Desktop opens Login → QR Code tab → QR code is generated
2. Phone (already logged in) scans the QR code
3. Phone opens `/auth/qr/confirm?token=...` and confirms
4. Desktop polls and detects confirmation → logs in automatically

QR sessions expire after 5 minutes.

---

## Network Sharing

To access the app from other devices on the same WiFi:

```bash
# Start frontend with network access
cd shopnova-frontend
npm run dev -- --host
```

Create `shopnova-frontend/.env`:
```
VITE_API_URL=http://YOUR_PC_IP:8080
```

Open `http://YOUR_PC_IP:5173` on any device on the same network.

---

## Language Support

The app supports three languages switchable from the header:
- 🇬🇧 English
- 🇷🇼 Kinyarwanda
- 🇫🇷 French

Translated pages: Header, Footer, Login, Signup, About, Returns, Terms, Contact, Products.

---

## GitHub

[https://github.com/Muneza006/ShopNova](https://github.com/Muneza006/ShopNova)
