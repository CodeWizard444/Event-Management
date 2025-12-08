const express = require("express");
const router = express.Router();
const eventsController = require("../controllers/events.controller");

// Asigură-te că aceste nume (getEvents, getEventById, etc.) există în controller!

// GET /api/events (Listare)
router.get("/", eventsController.getEvents);

// GET /api/events/:id (Detalii)
router.get("/:id", eventsController.getEventById);

// POST /api/events (Creare - pentru organizatori)
router.post("/", eventsController.createEvent);

// POST /api/events/:id/register (Înscriere student)
router.post("/:id/register", eventsController.registerForEvent);

// GET /api/events/:id/participants (Vezi participanți)
router.get("/:id/participants", eventsController.getParticipants);

module.exports = router;