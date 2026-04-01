const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(express.json());


// ================= ROLE MIDDLEWARE =================

const checkRole = (roles) => {
 

  return (req, res, next) => {
     console.log("Checking roles:", req.headers.role);
    const userRole = req.headers.role;

    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};


// ================= ROOT =================

app.get("/", (req, res) => {
  res.send("Server working 🚀");
});


// ================= USERS =================

// Create user (ADMIN only)
app.post("/users", checkRole(["ADMIN"]), async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    const validRoles = ["ADMIN", "ANALYST", "VIEWER"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await prisma.user.create({
      data: { name, email, role },
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get users (ADMIN only)
app.get("/users", checkRole(["ADMIN"]), async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= RECORDS =================

// Create record (ADMIN only)
app.post("/records", checkRole(["ADMIN"]), async (req, res) => {
  try {
    const { amount, type, category } = req.body;

    if (!amount || !type || !category) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be positive" });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    const record = await prisma.record.create({
      data: { amount, type, category },
    });

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get records (ALL roles + filter)
app.get(
  "/records",
  checkRole(["ADMIN", "ANALYST", "VIEWER"]),
  async (req, res) => {
    try {
      const { type, category } = req.query;

      const records = await prisma.record.findMany({
        where: {
          type: type || undefined,
          category: category || undefined,
        },
      });

      res.json(records);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);


// ================= UPDATE RECORD =================

// Update record (ADMIN only)
app.put("/records/:id", checkRole(["ADMIN"]), async (req, res) => {
  try {
    const record = await prisma.record.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= DELETE RECORD =================

// Delete record (ADMIN only)
app.delete("/records/:id", checkRole(["ADMIN"]), async (req, res) => {
  try {
    await prisma.record.delete({
      where: { id: req.params.id },
    });

    res.json({ message: "Record deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= DASHBOARD =================

// Dashboard (ADMIN + ANALYST)
app.get(
  "/dashboard",
  checkRole(["ADMIN", "ANALYST"]),
  async (req, res) => {
    try {
      const income = await prisma.record.aggregate({
        _sum: { amount: true },
        where: { type: "income" },
      });

      const expense = await prisma.record.aggregate({
        _sum: { amount: true },
        where: { type: "expense" },
      });

      res.json({
        totalIncome: income._sum.amount || 0,
        totalExpense: expense._sum.amount || 0,
        balance:
          (income._sum.amount || 0) -
          (expense._sum.amount || 0),
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);


// ================= SERVER =================

app.listen(3000, () => {
  console.log("Server running on port 3000");
});