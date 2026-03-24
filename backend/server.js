require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// Root
app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

// Tables
app.get("/tables", async (req, res) => {
  const result = await db.query(
    `SELECT table_name FROM information_schema.tables WHERE table_schema='public'`
  );
  res.json(result.rows);
});

// Get table data
app.get("/table/:name", async (req, res) => {
  const result = await db.query(`SELECT * FROM ${req.params.name}`);
  res.json(result.rows);
});

// Update
app.put("/update/:table/:id", async (req, res) => {
  const { table, id } = req.params;
  const updates = req.body;

  const keys = Object.keys(updates);
  const values = Object.values(updates);

  const setQuery = keys.map((key, i) => `${key}=$${i + 1}`).join(", ");

  const query = `
    UPDATE ${table}
    SET ${setQuery}
    WHERE id = ${id}
    RETURNING *;
  `;

  const result = await db.query(query, values);
  res.json(result.rows[0]);
});

// Insert (FIXED)
app.post("/insert/:table", async (req, res) => {
  try {
    const { table } = req.params;
    let data = req.body;

    console.log("TABLE:", table);
    console.log("DATA:", data);

    if (table === "products") {
      if (!data.price || data.price === "") data.price = 0;
    }

    if (table === "orders") {
      if (!data.quantity || data.quantity === "") data.quantity = 1;
    }

    const keys = Object.keys(data);
    const values = Object.values(data);

    const query = `
      INSERT INTO ${table} (${keys.join(",")})
      VALUES (${keys.map((_, i) => `$${i + 1}`).join(",")})
      RETURNING *;
    `;

    const result = await db.query(query, values);
    res.json(result.rows[0]);

  } catch (err) {
    console.error("INSERT ERROR:", err.message);
    res.status(500).send(err.message);
  }
});

// Delete
app.delete("/delete/:table/:id", async (req, res) => {
  const { table, id } = req.params;
  await db.query(`DELETE FROM ${table} WHERE id=$1`, [id]);
  res.json({ message: "Deleted" });
});

// 🤖 ADVANCED AI
app.post("/ai-query", async (req, res) => {
  try {
    const { prompt } = req.body;
    const text = prompt.toLowerCase();

    let table = "users";

    if (text.includes("product")) table = "products";
    if (text.includes("order")) table = "orders";

    let sqlQuery = `SELECT * FROM ${table}`;

    if (text.includes("count")) {
      sqlQuery = `SELECT COUNT(*) FROM ${table}`;
    }

    if (text.includes("latest")) {
      sqlQuery = `SELECT * FROM ${table} ORDER BY id DESC`;
    }

    if (text.includes("price") && table === "products") {
      sqlQuery = `SELECT name, price FROM products`;
    }

    console.log("AI:", sqlQuery);

    const result = await db.query(sqlQuery);

    res.json({
      query: sqlQuery,
      data: result.rows
    });

  } catch (err) {
    res.status(500).send("AI failed");
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));