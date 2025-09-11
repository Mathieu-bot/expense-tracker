import dns from "node:dns";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { requireAuth } from "./middleware/auth.middleware.js";
import { PrismaClient } from "@prisma/client";
import incomeRoutes from "./routes/income.route.js";
import authRoutes from "./routes/auth.route.js";
import categoryRoutes from "./routes/category.route.js";
import userRoutes from "./routes/user.route.js";
import expenseRoutes from "./routes/expense.route.js";
import summaryRoutes from "./routes/summary.route.js";
import { configureNetwork } from "./utils/network.js";
import path from "node:path";

dotenv.config();

// Prefer IPv4 to mitigate environments where IPv6 routes time out
try {
  dns.setDefaultResultOrder("ipv4first");
} catch {}

// try {
//   await configureNetwork();
// } catch {}

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  helmet({
    contentSecurityPolicy:
      process.env.NODE_ENV === "production" ? undefined : false,
  })
);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || true,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Serve receipt uploads statically
app.use("/uploads", express.static(path.resolve("uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/incomes", requireAuth, incomeRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/user", requireAuth, userRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/summary", requireAuth, summaryRoutes);

// Initialize a single Prisma client instance
const prisma = new PrismaClient();

app.get("/", (req, res) => {
  res.json({ message: "Expense Tracker API", status: "running" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// DB health check using Prisma raw query; does not require any models
app.get("/api/db-check", async (_req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT NOW() as now`;
    // Result shape differs by driver; normalize to { now }
    const now = Array.isArray(result)
      ? result[0]?.now ?? result[0]?.NOW ?? result[0]
      : result?.now ?? result;
    res.json({ ok: true, now });
  } catch (err) {
    console.error("DB check failed:", err);
    res.status(500).json({ ok: false, error: "DB connection failed" });
  }
});

// global error handler (keep last, before listen)
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const status = err?.status || 500;
  const payload = { error: err?.message || "Internal Server Error" };
  if (err?.details) payload.details = err.details;
  if (status >= 500) {
    console.error("Unhandled error:", err);
  }
  res.status(status).json(payload);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
