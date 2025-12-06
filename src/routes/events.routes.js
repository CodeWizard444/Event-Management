const express = require("express");
const router = express.Router();
const eventsController = require("../controllers/events.controller");

router.get("/", eventsController.getEvents);
router.get("/:id", eventsController.getEventById);
router.post("/", eventsController.createEvent);

router.post("/:id/register", eventsController.registerForEvent);
router.get("/:id/participants", eventsController.getParticipants);
router.delete("/:eventId/participants/:participantEmail", eventsController.removeParticipant);

module.exports = router;
