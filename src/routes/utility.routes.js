const express = require("express");
const router = express.Router();
const notificationController = require('../controllers/notification.controller'); 


router.post("/notifications/send", notificationController.sendEventNotification); 


router.post("/storage/upload", utilityController.uploadMaterial); 


router.get("/reports/generate", utilityController.generateReport);

module.exports = router;
