const users = require("../data/users.json");
const fs = require("fs");
const path = require("path");

// Helper pentru a salva userii noi în fișier (opțional, dacă vrei persistență)
const saveUsers = (data) => {
  fs.writeFileSync(path.join(__dirname, "../data/users.json"), JSON.stringify(data, null, 2));
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  // 1. Căutăm userul
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Email sau parolă incorectă" });
  }

  // 2. Returnăm un token "fake" (sau JWT real dacă instalezi jsonwebtoken)
  // Pentru simplitate acum, returnăm un token simplu și datele userului
  const token = `fake-jwt-token-for-${user.id}`;

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      faculty: user.faculty
    }
  });
};

exports.register = (req, res) => {
  const { name, email, password, role, faculty } = req.body;

  // 1. Verificăm dacă există deja
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: "Emailul este deja folosit." });
  }

  // 2. Creăm userul nou
  const newUser = {
    id: "u" + Date.now(),
    name,
    email,
    password, // În producție aici se face hash
    role: role || "STUDENT", // Default student
    faculty: faculty || ""
  };

  users.push(newUser);
  // saveUsers(users); // Decomentează dacă vrei să scrie în fișier

  res.status(201).json({ message: "Cont creat cu succes!", userId: newUser.id });
};

// --- LOGICĂ NOUĂ ---
exports.logout = (req, res) => {
    // Într-o aplicație reală, aici ai putea pune token-ul într-un Blacklist (Redis/DB)
    // Momentan, doar informăm clientul că acțiunea a reușit
    res.status(200).json({ message: "Logout realizat cu succes." });
};