const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controllers");

// POST /api/auth/login
router.post("/login", authController.login);

// POST /api/auth/register
router.post("/register", authController.register);

module.exports = router;