require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "EduSphere ERP API Backend",
    timestamp: new Date().toISOString(),
  });
});

// Authentication Endpoints Placeholder (Ready for future backend integration)
app.post("/api/auth/login", (req, res) => {
  const { identifier, password } = req.body;
  // Integration point: validate credentials against database
  res.status(501).json({
    message: "Backend auth integration pending.",
    receivedData: { identifier },
  });
});

app.post("/api/auth/register", (req, res) => {
  const { role, email, fullName } = req.body;
  // Integration point: create user record in database
  res.status(501).json({
    message: "Backend registration integration pending.",
    receivedData: { role, email, fullName },
  });
});

app.listen(PORT, () => {
  console.log(`EduSphere ERP Backend Server running on port ${PORT}`);
});
