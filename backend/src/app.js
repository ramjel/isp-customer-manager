require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const planRoutes = require("./routes/planRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

/**
 * ✅ Allowed origins (PRODUCTION READY)
 */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://isp-customer-manager.vercel.app",
  "https://fibernetoperation.info",
  "https://www.fibernetoperation.info",
];

/**
 * ✅ CORS CONFIG (FIXED FOR VERCEL + RENDER)
 */
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow mobile apps, Postman, server-to-server
      if (!origin) return callback(null, true);

      // Allow exact matches
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow all Vercel preview deployments (VERY IMPORTANT)
      if (origin.includes("vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error("Blocked by CORS policy"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

/**
 * ✅ JSON BODY PARSER
 */
app.use(express.json());

/**
 * ✅ HEALTH CHECK
 */
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API is running" });
});

/**
 * ✅ ROUTES
 */
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/dashboard", dashboardRoutes);

/**
 * ❌ ERROR HANDLER (MUST BE LAST)
 */
app.use(errorHandler);

/**
 * 🚀 START SERVER
 */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
