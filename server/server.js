import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DB_CONN,
});

/* GET REVIEWS */
app.get("/reviews", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM reviews ORDER BY created_at DESC",
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/* POST REVIEW */
app.post("/reviews", async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO reviews (rating, comment) VALUES ($1, $2) RETURNING *",
      [rating, comment],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 4242;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ADD LIKE BUTTON 👍//
app.patch("/reviews/:id/like", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "UPDATE reviews SET likes = likes + 1 WHERE id = $1 RETURNING *",
      [id],
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to like review" });
  }
});
