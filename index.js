const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const path = require("path");

const app = express();
const port = 3000;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "repertorio",
  password: "",
  port: 5432,
});

app.use(cors());
app.use(bodyParser.json());

// Ruta para servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Ruta POST /cancion
app.post("/cancion", async (req, res) => {
  const { titulo, artista, tono } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO canciones (titulo, artista, tono) VALUES ($1, $2, $3) RETURNING *",
      [titulo, artista, tono]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al insertar canción" });
  }
});

// Ruta GET /canciones
app.get("/canciones", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM canciones");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener canciones" });
  }
});

// Ruta PUT /cancion/:id
app.put("/cancion/:id", async (req, res) => {
  const { id } = req.params;
  const { titulo, artista, tono } = req.body;
  try {
    const result = await pool.query(
      "UPDATE canciones SET titulo = $1, artista = $2, tono = $3 WHERE id = $4 RETURNING *",
      [titulo, artista, tono, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar canción" });
  }
});

// Ruta DELETE /cancion
app.delete("/cancion", async (req, res) => {
  const { id } = req.query;
  try {
    await pool.query("DELETE FROM canciones WHERE id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar canción" });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
