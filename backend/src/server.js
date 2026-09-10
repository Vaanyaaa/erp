require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const { sequelize, usePostgres } = require("./config/database");
require("./models");

const authRoutes = require("./routes/auth.routes");
const noticeRoutes = require("./routes/notices.routes");
const tpcellRoutes = require("./routes/tpcell.routes");
const calendarRoutes = require("./routes/calendar.routes");
const documentRoutes = require("./routes/documents.routes");
const academicRoutes = require("./routes/academics.routes");
const materialRoutes = require("./routes/materials.routes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json({ limit: "2mb" }));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Acadex API Backend",
    database: usePostgres ? "postgres" : "sqlite",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/tpcell", tpcellRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/academics", academicRoutes);
app.use("/api/materials", materialRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `No endpoint at ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Something went wrong on the server." });
});

async function start() {
  await sequelize.authenticate();
  // Plain sync only creates missing tables. `alter: true` looks convenient but
  // on SQLite it rebuilds tables through a backup copy and silently drops
  // association foreign keys, which wipes seeded relationships on every boot.
  await sequelize.sync();
  console.log(`Database ready (${usePostgres ? "postgres" : "sqlite"})`);
  app.listen(PORT, () => {
    console.log(`Acadex Backend Server running on port ${PORT}`);
  });
}

if (require.main === module) {
  start().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
}

module.exports = { app, start };
