# AutoCare — Vehicle Service & Repair Booking Website

A full-stack MERN application for booking vehicle servicing appointments.
Customers browse services, book a slot, and pay cash on service. Admins
manage services, bookings, and worker (technician) profiles.

---

## Tech Stack

- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT auth, bcrypt
- **Frontend:** React 18 (Vite), React Router v6, Axios, plain CSS (design
  system in `src/styles`, no UI framework)
- **Payment:** Cash on Delivery / Pay on Service only — no payment gateway

---

## Folder Structure

```
vehicle-service-app/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── models/                   # User, Service, Worker, Booking schemas
│   ├── middleware/                # auth (JWT) + central error handler
│   ├── controllers/               # business logic per resource
│   ├── routes/                    # Express routers
│   ├── seed/seed.js               # seeds 6 services, 6 workers, 1 admin
│   ├── server.js                  # app entry point
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/axios.js           # axios instance + JWT interceptor
    │   ├── context/AuthContext.jsx
    │   ├── components/            # Navbar, Footer, cards, modals, route guards
    │   ├── pages/                 # customer-facing pages
    │   ├── pages/admin/           # admin panel pages
    │   ├── styles/                # variables.css, index.css, components.css, pages.css
    │   └── utils/helpers.js
    └── .env.example
```

---

## 1. Backend Setup

```bash
cd backend
cp .env.example .env     # edit MONGO_URI / JWT_SECRET / admin credentials as needed
npm install
npm run seed              # creates the 6 services, 6 workers, and the admin account
npm run dev                # starts the API on http://localhost:5000
```

`MONGO_URI` can point at a local MongoDB instance
(`mongodb://127.0.0.1:27017/vehicle_service_db`) or a MongoDB Atlas
connection string.

**Default admin login** (from `.env.example`, change before production use):
- Email: `admin@autocare.com`
- Password: `Admin@12345`

## 2. Frontend Setup

```bash
cd frontend
cp .env.example .env     # set VITE_API_URL if your backend isn't on localhost:5000
npm install
npm run dev                # starts the app on http://localhost:5173
```

Register a new account from the UI to use the customer side, or log in
with the seeded admin credentials to use `/admin`.

---

## API Reference

| Method | Endpoint                          | Access        | Description |
|--------|------------------------------------|---------------|-------------|
| POST   | /api/auth/register                 | Public        | Create a customer account |
| POST   | /api/auth/login                    | Public        | Login (returns role-aware user + JWT) |
| GET    | /api/auth/me                       | Private       | Get current user |
| GET    | /api/services                      | Public        | List active services (`?all=true` for admin) |
| POST   | /api/services                      | Admin         | Create a service |
| PUT    | /api/services/:id                  | Admin         | Update / hide a service |
| DELETE | /api/services/:id                  | Admin         | Delete a service |
| GET    | /api/workers                       | Public        | List worker profiles |
| POST   | /api/workers                       | Admin         | Add a worker |
| PUT    | /api/workers/:id                   | Admin         | Update a worker |
| DELETE | /api/workers/:id                   | Admin         | Remove a worker |
| GET    | /api/workers/:id/schedule          | Admin         | Worker's assigned jobs (notification view) |
| POST   | /api/bookings                      | Customer      | Create a booking |
| GET    | /api/bookings/my                   | Customer      | View own bookings |
| PUT    | /api/bookings/:id/cancel            | Customer      | Cancel an active booking |
| PUT    | /api/bookings/:id/reschedule         | Customer      | Reschedule an active booking |
| GET    | /api/bookings                      | Admin         | View all bookings (`?status=`) |
| PUT    | /api/bookings/:id/status             | Admin         | Approve/reject/complete + assign worker |
| GET    | /api/reports/summary                | Admin         | Bookings + revenue summary |

---

## Design Notes

- **Worker notification system:** Workers don't have a login portal. When
  an admin assigns a worker to a booking, the booking is flagged
  (`workerNotified: true`) and immediately appears on that worker's
  schedule view (`/admin/workers/:id/schedule`), which the admin can use
  to relay the job details to the technician.
- **"Manage Users" was intentionally removed** from the admin panel per
  the project spec — admins manage services, bookings, and workers only.
- **Soft delete for services:** deleting a service removes it from the
  catalog, but each booking stores a snapshot of the service name and
  price at booking time, so historical records and reports stay accurate.
- **Payment:** every booking is created with `paymentMethod: "Cash on
  Delivery"` and there is no payment gateway integration anywhere in the
  app, per spec.

---

## Verification Performed

- All backend files pass `node --check` (syntax-clean).
- The Express server boots and listens with the full route tree wired up.
- The React frontend builds cleanly with `npm run build` (Vite/esbuild,
  zero errors).
- A live MongoDB instance was not available in this environment, so the
  full request/response cycle (e.g. seeding, login, booking creation)
  has not been exercised end-to-end — test this first thing after
  connecting your own MongoDB instance.
