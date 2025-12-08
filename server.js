const app = require("./src/app");

const PORT = process.env.PORT || 5000;

// Salvăm instanța serverului într-o variabilă
const server = app.listen(PORT, () => {
  console.log("Server pornit pe portul " + PORT);
});

// Ascultăm erorile care pot opri serverul (ex: port deja ocupat)
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`EROARE: Portul ${PORT} este deja ocupat!`);
        console.error(`Încearcă să închizi alte terminale sau schimbă portul în 5001.`);
    } else {
        console.error("A apărut o eroare la server:", err);
    }
});