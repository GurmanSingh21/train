require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const bookingRoutes = require("./routes/bookingRoutes");
const cors = require("cors");

const app = express();

// Enable CORS with the allowed origin
app.use(cors({
  origin: 'https://your-frontend-url.com',
  methods: ['GET', 'POST'],
}));

app.use(bodyParser.json());

// Main Route
app.use("/api/bookings", bookingRoutes);

// Error Handling
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

// Starting Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
