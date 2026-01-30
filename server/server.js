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

app.listen(4242, () => {
  console.log("Server running on port 4242");
});
