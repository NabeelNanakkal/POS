# POS System Backend

A modern, secure, and scalable Node.js + Express + MongoDB backend for Point of Sale (POS) system with comprehensive authentication, authorization, and RESTful APIs.

## Features

- ✅ **JWT Authentication** - Access tokens (15 min) + Refresh tokens (7 days)
- ✅ **Role-Based Access Control (RBAC)** - Super Admin, Admin, Manager, Cashier, Inventory Manager
- ✅ **Comprehensive APIs** - Products, Categories, Customers, Orders, Employees, Stores, Inventory, Payments
- ✅ **Security** - Helmet, CORS, Rate Limiting, Input Validation, Password Hashing
- ✅ **Multi-Store Support** - Manage multiple store locations
- ✅ **Inventory Management** - Stock tracking, transfers, low stock alerts
- ✅ **Order Management** - Complete order lifecycle with refunds
- ✅ **Payment Processing** - Multiple payment methods (Cash, Card, UPI, Wallet)
- ✅ **Error Handling** - Centralized error handling with custom error classes
- ✅ **Logging** - Winston logger with file and console transports

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken)
- **Security:** Helmet, CORS, bcryptjs, express-rate-limit
- **Validation:** express-validator
- **Logging:** Winston, Morgan

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/pos_system
   JWT_ACCESS_SECRET=your_access_secret_key
   JWT_REFRESH_SECRET=your_refresh_secret_key
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start the server:**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Server will be running at:**
   ```
   http://localhost:5000
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/me` - Get current user profile

### Products
- `GET /api/products` - List products (with pagination, search, filters)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Manager+)
- `PUT /api/products/:id` - Update product (Manager+)
- `DELETE /api/products/:id` - Delete product (Admin+)
- `GET /api/products/low-stock` - Get low stock products

### Categories
- `GET /api/categories` - List categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category (Manager+)
- `PUT /api/categories/:id` - Update category (Manager+)
- `DELETE /api/categories/:id` - Delete category (Admin+)

### Customers
- `GET /api/customers` - List customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `PATCH /api/customers/:id/loyalty` - Update loyalty points
- `DELETE /api/customers/:id` - Delete customer (Admin+)

### Orders
- `GET /api/orders` - List orders (with filters)
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create order
- `PATCH /api/orders/:id/status` - Update order status (Manager+)
- `POST /api/orders/:id/refund` - Process refund (Manager+)
- `GET /api/orders/stats` - Get order statistics (Manager+)

### Stores
- `GET /api/stores` - List stores
- `GET /api/stores/:id` - Get store by ID
- `POST /api/stores` - Create store (Admin+)
- `PUT /api/stores/:id` - Update store (Admin+)
- `DELETE /api/stores/:id` - Delete store (Super Admin)

### Employees
- `GET /api/employees` - List employees (Manager+)
- `GET /api/employees/:id` - Get employee by ID (Manager+)
- `POST /api/employees` - Create employee (Admin+)
- `PUT /api/employees/:id` - Update employee (Admin+)
- `DELETE /api/employees/:id` - Delete employee (Admin+)

### Inventory
- `GET /api/inventory` - List inventory
- `GET /api/inventory/:id` - Get inventory by ID
- `POST /api/inventory/adjust` - Adjust stock (Inventory Manager+)
- `POST /api/inventory/transfer` - Transfer between stores (Inventory Manager+)
- `GET /api/inventory/alerts` - Get low stock alerts

### Payments
- `GET /api/payments` - List payments (Manager+)
- `GET /api/payments/:id` - Get payment by ID
- `POST /api/payments` - Process payment
- `GET /api/payments/stats` - Get payment statistics (Manager+)

## User Roles

- **SUPER_ADMIN** - Full system access
- **ADMIN** - Store and employee management
- **MANAGER** - Store operations, reports, employee oversight
- **CASHIER** - POS operations, customer management
- **INVENTORY_MANAGER** - Inventory and stock management

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── constants.js      # Environment configuration
│   │   └── database.js       # MongoDB connection
│   ├── models/               # Mongoose models
│   ├── controllers/          # Route controllers
│   ├── routes/               # API routes
│   ├── middleware/           # Custom middleware
│   ├── validators/           # Input validation
│   ├── utils/                # Utility functions
│   ├── app.js                # Express app setup
│   └── server.js             # Server entry point
├── .env.example              # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Security Features

- **Password Hashing** - bcryptjs with salt rounds
- **JWT Tokens** - Secure token-based authentication
- **Rate Limiting** - Prevent brute force attacks
- **Input Validation** - express-validator for all inputs
- **CORS** - Configured cross-origin resource sharing
- **Helmet** - Security headers
- **Role-Based Access** - Granular permission control

## Error Handling

All errors are handled centrally with consistent response format:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message"
}
```

## Development

```bash
# Install dependencies
npm install

# Run in development mode with auto-reload
npm run dev

# Run in production mode
npm start
```

## License

ISC

## Support

For issues and questions, please create an issue in the repository.
