require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // Necesario para recibir JSON
app.use(express.static("public"));

// Configuración de conexión a la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Conexión a la base de datos
db.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
    return;
  }
  console.log("Conectado a la base de datos");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/submit-form", (req, res) => {
  const { nombre, correo, celular } = req.body;
  console.log("Datos recibidos:", req.body); // Verifica los datos recibidos

  const query =
    "INSERT INTO clientes (nombre, correo, celular) VALUES (?, ?, ?)";
  db.query(query, [nombre, correo, celular], (err, result) => {
    if (err) {
      console.error("Error al insertar datos:", err);
      res
        .status(500)
        .json({ success: false, message: "Tu correo ya esta registrado" });
      return;
    }
    res
      .status(200)
      .json({ success: true, message: "Formulario enviado correctamente" });
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
