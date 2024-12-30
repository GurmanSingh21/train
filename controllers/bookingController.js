const { getSeats, bookSeats, resetSeats } = require("../models/seatModel");

const viewSeats = async (req, res, next) => {
  try {
    const seats = await getSeats();
    // Map seats to add 'status' based on 'booked' field
    const formattedSeats = seats.map(seat => ({
      ...seat,
      status: seat.booked ? 'booked' : 'available',
    }));
    res.json(formattedSeats);
  } catch (error) {
    next(error);
  }
};

const reserveSeats = async (req, res, next) => {
  try {
    const { seatIds } = req.body;

    if (!seatIds || !Array.isArray(seatIds)) {
      return res.status(400).json({ error: "Invalid seatIds format." });
    }

    const bookedSeats = await bookSeats(seatIds);
    if (!bookedSeats || bookedSeats.length === 0) {
      return res.status(400).json({ error: "Seats cannot be booked." });
    }

    res.json({ message: "Seats booked successfully", bookedSeats });
  } catch (error) {
    next(error);
  }
};

const resetAllSeats = async (req, res, next) => {
  try {
    const result = await resetSeats();
    res.json({ message: "All seats reset successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = { viewSeats, reserveSeats, resetAllSeats };
