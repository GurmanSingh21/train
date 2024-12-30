const express = require("express");
const router = express.Router();
const { viewSeats, reserveSeats, resetAllSeats } = require("../controllers/bookingController");

router.get("/view", viewSeats); // View all seats
router.post("/reserve", reserveSeats); // Reserve seats
router.post("/reset", resetAllSeats); // Reset all seats

module.exports = router;
