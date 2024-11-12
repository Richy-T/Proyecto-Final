const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const connection = require("./db"); // Asegúrate de que esta línea sea correcta

const app = express();
const PORT = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({ secret: "mi_secreto", resave: false, saveUninitialized: true })
);
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect("/login"); // Redirige a la página de login
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/views/login.html");
});

app.post("/auth", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    // Asegúrate de que estás usando la conexión correcta aquí
    connection.query(
      "SELECT * FROM Administradores WHERE username = ? AND password = ?",
      [username, password],
      (error, results) => {
        if (error) {
          console.error(error); // Muestra el error en consola para depuración
          return res.send("Error en la consulta.");
        }
        if (results.length > 0) {
          req.session.loggedin = true;
          req.session.username = username;
          res.redirect("/clientes");
        } else {
          res.send("Usuario o contraseña incorrectos.");
        }
      }
    );
  } else {
    res.send("Por favor ingresa usuario y contraseña.");
  }
});
app.get("/clientes", (req, res) => {
  if (req.session.loggedin) {
    connection.query(
      "SELECT nombre, correo, celular FROM clientes",
      (error, results) => {
        if (error) throw error;

        // Generar el HTML para la tabla
        let tableRows = results
          .map(
            (cliente) => `
                <tr>
                    <td>${cliente.nombre}</td>
                    <td>${cliente.correo}</td>
                    <td>${cliente.celular}</td>
                </tr>
            `
          )
          .join("");

        const html = `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Dashboard de Clientes</title>
                    <link href="/css/stylesTabla.css" rel="stylesheet" id="style">

                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
                </head>
                <body>
                    <div class="container mt-4">
                        <h1 class="text-center">Charlor Store Clientes</h1>
                        <table class="table table-striped">
                            <thead>
                                <tr class="center">
                                    <th>NOMBRE</th>
                                    <th>CORREO</th>
                                    <th>CELULAR</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRows}
                            </tbody>
                        </table>
                        <a href="/logout" class="btn btn-danger">Cerrar sesión</a>
                    </div>
                </body>
                </html>
            `;
        res.send(html);
      }
    );
  } else {
    res.send("Por favor inicia sesión primero.");
  }
});

// app.get('/clientes', (req, res) => {
//     if (req.session.loggedin) {
//         connection.query('SELECT * FROM clientes', (error, results) => {
//             if (error) throw error;
//             res.send(`
//                 <h1>Clientes</h1>
//                 <ul>
//                     ${results.map(cliente => `<li>${cliente.nombre}</li>`).join('')}
//                 </ul>
//                 <ul>
//                 ${results.map(cliente => `<li>${cliente.correo}</li>`).join('')}
//                 </ul>
//                  <ul>
//                     ${results.map(cliente => `<li>${cliente.celular}</li>`).join('')}
//                 </ul>
//                 <a href="/logout">Cerrar sesión</a>
//             `);
//         });
//     } else {
//         res.send('Por favor inicia sesión primero.');
//     }
// });

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
