# POS System

A full-stack Point of Sale system built with React + Vite (frontend) and Node.js + Express + MongoDB (backend), structured as a monorepo.

---

## Project Structure

```
POS/
├── frontend/          # React + Vite client app
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── container/     # Redux slices & sagas (feature state)
│   │   ├── views/         # Page-level components
│   │   ├── services/      # API service layer
│   │   ├── store/         # Redux store setup
│   │   ├── routes/        # App routing
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   ├── constants/     # App-wide constants & enums
│   │   ├── layout/        # Layout components
│   │   ├── themes/        # MUI theme config
│   │   └── assets/        # Images, animations, styles
│   ├── .env.development
│   ├── .env.production
│   └── package.json
│
├── backend/           # Node.js + Express API server
│   ├── src/
│   │   ├── controllers/   # HTTP request handlers
│   │   ├── services/      # Business logic layer
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API route definitions
│   │   ├── middleware/    # Auth, RBAC, error handling
│   │   ├── validators/    # Request validation (express-validator)
│   │   ├── utils/         # Shared utilities
│   │   ├── config/        # App configuration
│   │   └── scripts/       # Seed & utility scripts
│   ├── .env
│   └── package.json
│
├── .gitignore         # Monorepo-wide git ignore
├── .prettierrc        # Shared code formatting config
└── README.md
```

---

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 18, Vite, Redux Toolkit, Redux-Saga, MUI v5 |
| Backend   | Node.js, Express 4, MongoDB, Mongoose   |
| Auth      | JWT (access + refresh token rotation)   |
| Styling   | Material UI + ApexCharts                |

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Yarn (frontend) / npm (backend)

### 1. Backend

```bash
cd backend
cp .env.example .env      # fill in your MongoDB URI & JWT secrets
npm install
npm run dev               # starts on http://localhost:5001
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env.development
yarn install
yarn start                # starts on http://localhost:3002
```

---

## Available Scripts

### Backend (`/backend`)

| Command           | Description                    |
|-------------------|--------------------------------|
| `npm run dev`     | Start dev server with nodemon  |
| `npm start`       | Start production server        |

### Frontend (`/frontend`)

| Command          | Description                        |
|------------------|------------------------------------|
| `yarn start`     | Start Vite dev server              |
| `yarn build`     | Build for production               |
| `yarn preview`   | Preview production build locally   |

---

## Environment Variables

### Backend (`.env`)
```env
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/pos
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
CORS_ORIGIN=http://localhost:3002
```

### Frontend (`.env.development`)
```env
VITE_APP_API_ENDPOINT=http://localhost:5001/api
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development
```

---

## Roles

| Role               | Access                                      |
|--------------------|---------------------------------------------|
| `SUPER_ADMIN`      | Full system access, manages store admins    |
| `STORE_ADMIN`      | Manages their own store(s)                  |
| `MANAGER`          | Products, inventory, reports                |
| `CASHIER`          | POS terminal, orders, shifts                |
| `ACCOUNTANT`       | Reports, payments                           |
| `INVENTORY_MANAGER`| Inventory management                        |
