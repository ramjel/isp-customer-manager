# ISP Customer Management System

Full-stack web application for managing ISP customers with login, CRUD, search, and dashboard statistics.

## Tech Stack

- **Frontend:** React (JSX), JavaScript, Vite
- **Backend:** Node.js, Express
- **Database:** PostgreSQL (pgAdmin4)

## Features

- User registration and login (JWT authentication)
- Customer CRUD: full name, contact number, address, internet plan, status
- Predefined internet plans + custom plan support
- Search customers by name, contact, address, or plan
- Dashboard with Total, Active, and Inactive customer tabs
- Responsive layout for mobile and desktop
- Basic input validation on frontend and backend

## Project Structure

```
isp-customer-manager/
├── backend/          # Express API
├── frontend/         # React app
├── database/
│   └── schema.sql    # PostgreSQL schema + seed data
└── README.md
```

## Database Setup (pgAdmin4)

1. Open **pgAdmin4**
2. Right-click **Databases** → **Create** → **Database**
3. Name it: `isp_customer_db`
4. Open **Query Tool** on `isp_customer_db`
5. Open and run `[database/schema.sql](database/schema.sql)`

### Default Admin Account

- **Username:** `admin`
- **Password:** `admin123`

You can also register a new account from the Register page.

## Backend Setup

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

Update `.env` with your PostgreSQL credentials:

```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/isp_customer_db
```

API runs at: `http://localhost:5000`

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App runs at: `http://localhost:5173`

## API Endpoints


| Method | Endpoint                 | Description              |
| ------ | ------------------------ | ------------------------ |
| POST   | `/api/auth/register`     | Register user            |
| POST   | `/api/auth/login`        | Login                    |
| GET    | `/api/auth/me`           | Current user (protected) |
| GET    | `/api/customers?search=` | List/search customers    |
| POST   | `/api/customers`         | Create customer          |
| PUT    | `/api/customers/:id`     | Update customer          |
| DELETE | `/api/customers/:id`     | Delete customer          |
| GET    | `/api/plans`             | List internet plans      |
| POST   | `/api/plans`             | Add custom plan          |
| GET    | `/api/dashboard/stats`   | Dashboard counts         |


## Deliverables

1. **Source code** — full project in this repository
2. **Database SQL file** — `[database/schema.sql](database/schema.sql)`

## Test Flow

1. Run database SQL in pgAdmin4
2. Start backend (`npm run dev` in `backend/`)
3. Start frontend (`npm run dev` in `frontend/`)
4. Login with `admin` / `admin123` or register
5. View dashboard stats
6. Add, edit, delete, and search customers

