# Order Management System

A full-stack multi-store order management system with real-time notifications.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Frontend:** Next.js, React, Tailwind CSS
- **Database:** MySQL
- **Real-time:** Socket.IO

## Features

- Create and manage orders across multiple stores
- Real-time order updates using WebSockets
- Order status management (PLACED → PREPARING → COMPLETED)
- Data archival for orders older than 30 days
- Analytics: daily orders, revenue per store, top selling items
- Pagination support

## Prerequisites

- Node.js v18+
- MySQL 8.0+

## Setup Instructions

### 1. Clone the repository
\```bash
git clone https://github.com/YourUsername/order-management.git
cd order-management
\```

### 2. Database Setup
Open MySQL and run:
\```sql
CREATE DATABASE order_management;
USE order_management;

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  store_id INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status ENUM('PLACED', 'PREPARING', 'COMPLETED') DEFAULT 'PLACED',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_store_id (store_id),
  INDEX idx_created_at (created_at)
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  item_id INT NOT NULL,
  qty INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE orders_archive (
  id INT NOT NULL,
  store_id INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status ENUM('PLACED', 'PREPARING', 'COMPLETED'),
  created_at TIMESTAMP,
  archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\```

### 3. Backend Setup
\```bash
cd backend
npm install
\```

Create a `.env` file in the `backend` folder:
\```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=order_management
\```

Run the backend:
\```bash
npm run dev
\```

### 4. Frontend Setup
\```bash
cd frontend
npm install
npm run dev
\```

Open browser at `http://localhost:3000`

## API Documentation

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orders` | Create a new order |
| GET | `/orders?store_id=1&page=1&limit=10` | Get orders by store |
| PATCH | `/orders/:id/status` | Update order status |
| POST | `/orders/archive-old-orders` | Archive orders older than 30 days |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/orders/analytics/daily` | Orders per day |
| GET | `/orders/analytics/revenue` | Revenue per store |
| GET | `/orders/analytics/top-items` | Top 5 selling items |

## Real-time Events

| Event | Trigger |
|-------|---------|
| `new_order` | When a new order is created |
| `order_updated` | When order status is updated |

## Folder Structure

\```
order-management/
├── backend/
│   ├── src/
│   │   ├── config/        # Database connection
│   │   ├── controllers/   # Business logic
│   │   ├── middleware/     # Validation
│   │   ├── routes/        # API routes
│   │   └── socket/        # WebSocket logic
│   └── server.js
└── frontend/
    ├── app/
    │   ├── create-order/  # Create order page
    │   ├── orders/        # Orders list page
    │   └── update-status/ # Update status page
    ├── components/        # Reusable components
    └── lib/               # API and socket helpers
\```