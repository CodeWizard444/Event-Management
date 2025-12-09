const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controllers");

router.post("/login", authController.login);
router.post("/register", authController.register);

// Ruta nouă de Logout
router.post("/logout", authController.logout);

module.exports = router;