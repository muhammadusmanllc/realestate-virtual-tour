// server.js
import express from "express";
import authRoutes from "./routes/auth.js"; // Auth routes
import propertyRoutes from "./routes/property.js"; // Property routes

const app = express(); // Initialize app

// Middleware
app.use(express.json());

// Routes
app.use("/auth", authRoutes); // Auth endpoints
app.use("/property", propertyRoutes); // Property endpoints

// Default route (optional)
app.get("/", (req, res) => {
  res.send("Welcome to Rental Backend API 🚀");
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});