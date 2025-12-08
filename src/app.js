const express = require("express");
const cors = require("cors");
const path = require("path"); // <--- Necesar pentru calea folderului de upload

// Import Rute
const eventsRouter = require("./routes/events.routes");
const organizersRouter = require("./routes/organizers.routes");
const utilityRouter = require("./routes/utility.routes");
const authRouter = require("./routes/auth.routes"); // <--- IMPORT NOU (pentru Login/Register)
const adminRouter = require("./routes/admin.routes"); // <--- IMPORT NOU (pentru Admin Dashboard)

const app = express();

app.use(cors());
app.use(express.json());

// Configurare pentru a servi fișierele statice (imagini uploadate)
// Asta permite accesarea http://localhost:5000/uploads/nume-fisier.jpg
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Definire Rute API
app.use("/api/events", eventsRouter);
app.use("/api/organizers", organizersRouter);
app.use("/api/utility", utilityRouter); // <--- Am schimbat din 'utils' in 'utility' pentru a potrivi cu testele Postman
app.use("/api/auth", authRouter);       // <--- RUTĂ NOUĂ
app.use("/api/admin", adminRouter);     // <--- RUTĂ NOUĂ

// Handler pentru rute inexistente (404)
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

module.exports = app;