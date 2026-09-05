require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const { sequelize } = require("./models");

const authRoutes = require("./routes/authRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const questionBankRoutes = require("./routes/questionBankRoutes");
const ocrRoutes = require("./routes/ocrRoutes");
const calendarRoutes = require("./routes/calendarRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (scanned question papers, etc.) statically so the
// frontend can link/display them directly.
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "EduSphere ERP API Backend",
    timestamp: new Date().toISOString(),
  });
});

// Route groups
app.use("/api/auth", authRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/question-bank", questionBankRoutes);
app.use("/api/ocr", ocrRoutes);
app.use("/api/calendar", calendarRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// Central error handler (catches multer errors, unhandled throws, etc.)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong.",
  });
});

async function start() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established.");

    // sync({ alter: true }) auto-updates tables to match the models below —
    // convenient for a hackathon/early-stage build. Once this is in
    // production with real data, switch to proper migrations instead
    // (e.g. umzug or sequelize-cli) so schema changes don't risk data loss.
    await sequelize.sync({ alter: true });
    console.log("✅ Database synced.");

    app.listen(PORT, () => {
      console.log(`🚀 EduSphere ERP Backend running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Unable to start server:", err);
    process.exit(1);
  }
}

start();

module.exports = app;
