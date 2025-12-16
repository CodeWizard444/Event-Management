// NOU: Importăm modelul User Mongoose
const User = require("../models/User"); 

// NOU: Importăm bcrypt pentru hash-uirea și verificarea parolei (ESENȚIAL PENTRU SECURITATE)
const bcrypt = require('bcryptjs'); 

// Modificat pentru a fi funcție ASYNC
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Căutăm userul DOAR după email
    const user = await User.findOne({ email }); 

    // 2. Verificăm dacă userul există
    if (!user) {
      return res.status(401).json({ message: "Email sau parolă incorectă" });
    }

    // 3. COMPARĂM PAROLA PRIMITĂ CU HASH-UL SALVAT ÎN DB
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Email sau parolă incorectă" });
    }
    
    // Logare reușită
    // 4. Returnăm un token "fake"
    // Folosim _id-ul generat de MongoDB
    const token = `fake-jwt-token-for-${user._id}`;

    res.json({
      token,
      user: {
        id: user._id, // Folosim _id-ul MongoDB
        name: user.name,
        email: user.email,
        role: user.role,
        faculty: user.faculty
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Eroare internă la autentificare." });
  }
};

// Modificat pentru a fi funcție ASYNC
exports.register = async (req, res) => {
  const { name, email, password, role, faculty } = req.body;

  try {
    // 1. Verificăm dacă există deja în MongoDB (folosim .findOne)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Emailul este deja folosit." });
    }

    // 2. HASH-UIREA PAROLEI (ESENȚIAL PENTRU SECURITATE)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Creăm userul nou folosind modelul Mongoose
    const newUser = new User({
      name,
      email,
      password: hashedPassword, // SALVĂM PAROLA HASH-UITĂ
      role: role || "STUDENT", 
      faculty: faculty || ""
    });

    // 4. Salvăm userul în MongoDB (Aici Mongoose creează colecția 'users' dacă nu există)
    const savedUser = await newUser.save(); 

    res.status(201).json({ message: "Cont creat cu succes!", userId: savedUser._id });
  } catch (error) {
    // Gestionarea erorilor Mongoose (validare, Required, Enum)
    console.error("Registration Error:", error);
    res.status(400).json({ 
        message: "Eroare la înregistrare. Datele trimise sunt invalide sau lipsesc câmpuri obligatorii.", 
        error: error.message 
    });
  }
};

// --- LOGICĂ NOUĂ --- (nu necesită modificări, nu accesează DB)
exports.logout = (req, res) => {
    res.status(200).json({ message: "Logout realizat cu succes." });
};