const { Pool } = require("pg");

// Configure database connection
const pool = new Pool({
  connectionString:
    process.env.NODE_ENV === "production"
      ? process.env.DATABASE_URL
      : "postgresql://postgres:WaheguruJi@localhost:5432/train_reservation", // Local database URL
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false, // SSL for production
});

// Fetch all seats sorted by seat_id
const getSeats = async () => {
  const result = await pool.query("SELECT * FROM seats ORDER BY seat_id");
  return result.rows;
};

// Reset all seats to available
const resetSeats = async () => {
  const result = await pool.query("UPDATE seats SET booked = false");
  return result.rowCount; // Return the number of rows affected
};

// Book consecutive seats, handling across rows if necessary
const bookSeats = async (seatIds) => {
  if (!Array.isArray(seatIds) || seatIds.some((id) => isNaN(id))) {
    throw new Error("Invalid seatIds format. Must be an array of numbers.");
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const bookedSeats = [];
    const allSeats = await getSeats(); // Fetch all seats again

    // Try booking consecutive seats across multiple rows if necessary
    let remainingSeats = [...seatIds]; // Clone the seatIds array

    for (let i = 0; i < remainingSeats.length; i++) {
      const seatId = remainingSeats[i];

      // Find the first available seat in the database
      const result = await client.query(
        "UPDATE seats SET booked = true WHERE seat_id = $1 AND booked = false RETURNING *",
        [seatId]
      );

      if (result.rows.length === 0) {
        throw new Error(`Seat ${seatId} is already booked or does not exist.`);
      }

      bookedSeats.push(result.rows[0]);
    }

    // If some seats remain unbooked, handle splitting across rows
    if (bookedSeats.length < seatIds.length) {
      let seatsToBook = seatIds.slice(bookedSeats.length);

      // Booking remaining seats from available rows sequentially
      for (let seatId of seatsToBook) {
        const nextAvailableSeat = allSeats.find(
          (seat) => seat.booked === false
        ); // Find the next available seat
        if (nextAvailableSeat) {
          const result = await client.query(
            "UPDATE seats SET booked = true WHERE seat_id = $1 AND booked = false RETURNING *",
            [nextAvailableSeat.seat_id]
          );
          bookedSeats.push(result.rows[0]);
        }
      }
    }

    await client.query("COMMIT");
    return bookedSeats;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { getSeats, bookSeats, resetSeats };
