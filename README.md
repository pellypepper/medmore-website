
# 🛒 Commerce Foodstuff Website

Welcome to the **Commerce Foodstuff Website**!  
A full-stack eCommerce platform where users can browse foodstuff products, manage their cart, and securely checkout. Built using **React**, **Express.js**, and **PostgreSQL**, with seamless integrations like **Stripe** for payments and **Cloudinary** for media storage.

---

## 📚 Table of Contents

- [✨ Features](#-features)
- [🧰 Technologies Used](#-technologies-used)
- [⚙️ Installation](#-installation)
- [📦 Usage](#-usage)
- [🔌 API Endpoints](#-api-endpoints)
- [🚀 Deployment](#-deployment)
- [🧑‍💻 Contributing](#-contributing)
- [📄 License](#-license)

---Live Demo : https://medmorestore.onrender.com

## ✨ Features

- 🔐 **User Authentication** – Secure login/register with JWT.
- 🛍️ **Product Management** – Admin dashboard for CRUD operations on products.
- 🛒 **Shopping Cart** – Add to cart, update quantity, remove items, and checkout.
- 💳 **Stripe Integration** – Secure and modern payment gateway support.
- 📧 **Email Notifications** – Email confirmations for users and admins.
- 📱 **Responsive UI** – Mobile-first design using **Bootstrap**.

---

## 🧰 Technologies Used

### 🔻 Frontend
- React
- React Router
- Bootstrap
- Axios (for HTTP requests)
- Stripe (payment integration)

### 🔺 Backend
- Express.js
- PostgreSQL
- Nodemailer (email notifications)
- Cloudinary (image hosting)
- JSON Web Tokens (JWT) for authentication

### 🌐 Deployment
- **Render** (for hosting both frontend and backend)

---

## ⚙️ Installation

### 🔑 Prerequisites

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Cloudinary](https://cloudinary.com/) account
- [Stripe](https://stripe.com/) account

### 📦 Clone the Repository

```bash
git clone https://github.com/yourusername/commerce-foodstuff-website.git
cd commerce-foodstuff-website
📥 Install Dependencies
bash
Copy
Edit
# For both client and server
cd client
npm install
cd ../server
npm install
🔧 Setup Environment Variables
Create .env files in both client/ and server/ with appropriate values:

Server .env

env
Copy
Edit
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password_or_app_password
📦 Usage
🔨 Start Development Server
bash
Copy
Edit
# Start backend
cd server
npm run dev

# Start frontend
cd ../client
npm start
Visit http://localhost:3000 to view the app.

🔌 API Endpoints
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	User login
GET	/api/products	Get all products
POST	/api/products	Add product (Admin only)
PUT	/api/products/:id	Update product
DELETE	/api/products/:id	Delete product
POST	/api/orders	Create an order (checkout)



