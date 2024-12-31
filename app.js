require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const bookingRoutes = require("./routes/bookingRoutes");
const cors = require("cors");
const pool = require("./config/db");

const app = express();
const allowedOrigins = [
  'http://localhost:3001', // Local frontend
  'https://frontend-two-sigma-69.vercel.app', // Deployed frontend
];
// Enable CORS with the allowed origin
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(bodyParser.json());

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()"); // Test query
    res.status(200).json({ success: true, time: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Main Route
app.use("/api/bookings", bookingRoutes);

// Error Handling
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

// Starting Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
