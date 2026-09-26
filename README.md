# BIDVAULT – Online Auction & Bidding Platform

BIDVAULT is a full-stack online auction platform built with Node.js, Express, MySQL, and vanilla JavaScript. It allows sellers to list products and buyers to view live auctions, place bids, and track dashboard activity.

## Features

- Buyer and seller registration
- Secure login with password hashing
- Product listing and auction creation
- Live auction browsing and detail pages
- Bid placement with validation
- Seller and buyer dashboards
- Responsive frontend with validation feedback and loading states

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MySQL
- Security: bcrypt, dotenv

## Project Structure

```text
Online-Auction-Bidding-Platform/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── schema.sql
│   └── server.js
├── frontend/
│   ├── css/
│   ├── js/
│   ├── *.html
├── .env
├── .env.example
├── package.json
├── README.md
└── .gitignore
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start MySQL and create the database:

```sql
CREATE DATABASE bidvault;
USE bidvault;
SOURCE backend/schema.sql;
```

3. Confirm the database credentials in the .env file:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=bidvault
DB_PORT=3306
```

4. Start the backend server:

```bash
node backend/server.js
```

5. Open the frontend in a browser:

```text
frontend/index.html
```

## Default Demo Accounts

A seeded demo seller and buyer are included in the schema for quick testing:

- Seller: seller@bidvault.com / password123
- Buyer: buyer@bidvault.com / password123

## Important Notes

- The backend runs on http://localhost:5000
- The frontend pages use the local API and load data dynamically from the backend
- If MySQL credentials differ on your machine, update the values in .env before starting the server

## Screenshots

Add screenshots of the home page, auction page, seller dashboard, and buyer dashboard here after taking them in your environment.

## Run Checklist

- Backend server running
- MySQL server running
- Database created and schema imported
- Frontend pages loaded in browser
- Login and registration tested
- Auction browsing and bidding tested


## Project Overview

The platform provides a structured system for managing users, products, auctions, bids, winners, and notifications using a relational MySQL database. It is designed to make the auction process simple, organized, and transparent.

## Main Features

- User Registration and Login
- Buyer and Seller Roles
- Seller Product Management
- Product Listing
- Online Auction Management
- Bidding System
- Highest Bid Tracking
- Auction Winner Selection
- Notifications
- Buyer and Seller Dashboards
- Realtime Bidding

## Technologies Used

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js
- REST APIs

### Database
- MySQL

### Security
- bcrypt Password Hashing
- Environment Variables using `.env`

## Database

The main database entities include:

- Users
- Products
- Auctions
- Bids
- Auction Winners
- Notifications

## Project Structure

```text
Online-Auction-Bidding-Platform/
│
├── frontend/
├── backend/
├── README.md
├── .gitignore
├── package.json
└── package-lock.json
