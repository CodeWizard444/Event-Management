const express = require("express");
const router = express.Router();

// --- IMPORTURI NECESARE ---
const notificationController = require('../controllers/notification.controller');
// LINIA DE MAI JOS LIPSEA:
const utilityController = require('../controllers/utility.controller'); 

// Rute
router.post("/notifications/send", notificationController.sendEventNotification);

// Acum variabila utilityController există și nu va mai da eroare
router.post("/storage/upload", utilityController.uploadMaterial); 

router.get("/reports/generate", utilityController.generateReport);

module.exports = router;