# Finance Data Processing Backend

## 📌 Overview
This project is a backend system for managing financial data with role-based access control.  
Different users can interact with financial records based on their roles such as Admin, Analyst, and Viewer.

---

## 🚀 Features
- User management (create and view users)
- Financial records CRUD operations
- Filter records by type and category
- Dashboard summary (income, expenses, balance)
- Role-based access control
- Basic validation and error handling
- Update and delete records supported
- Supports update and delete operations
---

## 🛠 Tech Stack
- Node.js
- Express.js
- Prisma ORM
- SQLite

---

## ⚙️ Setup Instructions

1. Install dependencies  
npm install

2. Run database migration  
npx prisma migrate dev

3. Start the server  
node index.js

Server will run at:  
http://localhost:3000/

---

## 🔐 Roles & Permissions

| Role     | Access |
|----------|--------|
| ADMIN    | Full access (create, update, delete) |
| ANALYST  | View records and dashboard |
| VIEWER   | View records only |

---

## 📡 API Endpoints

### Users
- POST `/users` → Create user (Admin only)
- GET `/users` → Get all users (Admin only)

### Records
- POST `/records` → Create record (Admin only)
- GET `/records` → Get records (All roles)

### Dashboard
- GET `/dashboard` → Get summary (Admin, Analyst)

---

## 🧪 Example Request Header
Use this in Postman:


role: ADMIN


---

## 📊 Example Dashboard Response

```json
{
  "totalIncome": 5000,
  "totalExpense": 2000,
  "balance": 3000
}
