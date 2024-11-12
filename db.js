const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "Charlot",
  port: 3311,
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Conexión a la base de datos exitosa.");
});

// Exportar la conexión
module.exports = connection;
