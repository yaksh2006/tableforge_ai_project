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

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🤖 GEMINI AI
app.post("/ai-query", async (req, res) => {
  try {
    const { prompt } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const schema = `
    users(id, name, email)
    products(id, name, price)
    orders(id, product_name, quantity)
    `;

    const result = await model.generateContent(`
      Convert the user query into PostgreSQL SQL only.

      Schema:
      ${schema}

      Query:
      ${prompt}
    `);

    const response = await result.response;
    let sqlQuery = response.text();

    sqlQuery = sqlQuery.replace(/```sql/g, "").replace(/```/g, "").trim();

    console.log("PROMPT:", prompt);
    console.log("SQL:", sqlQuery);

    let data;

    try {
      data = await db.query(sqlQuery);
    } catch (dbErr) {
      console.error("SQL ERROR:", dbErr.message);

      return res.status(400).json({
        error: "Invalid SQL",
        query: sqlQuery,
      });
    }

    res.json({
      query: sqlQuery,
      data: data.rows,
    });

  } catch (err) {
    console.error("FULL ERROR:", err);
    res.status(500).send("Gemini AI failed");
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));