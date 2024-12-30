-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,      -- Auto-incrementing user ID
  username VARCHAR(255) UNIQUE NOT NULL,  -- Unique username
  password VARCHAR(255) NOT NULL          -- Hashed password
);

-- Seats Table
CREATE TABLE seats (
  seat_id SERIAL PRIMARY KEY, -- Auto-incrementing seat ID
  booked BOOLEAN DEFAULT FALSE, -- Booking status (default is false)
  user_id INT REFERENCES users(id) -- References the user who booked the seat
);

-- Populate Seats Table (80 seats)
DO $$
BEGIN
  FOR i IN 1..80 LOOP
    INSERT INTO seats (booked) VALUES (FALSE);
  END LOOP;
END $$;
