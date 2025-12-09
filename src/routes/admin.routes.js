const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

// Statistici Dashboard
router.get('/stats/dashboard', adminController.getDashboardStats);

// Validare Evenimente
router.get('/events/pending', adminController.getPendingEvents);
router.patch('/events/:id/status', adminController.updateEventStatus);

// --- RUTE NOI PENTRU RAPOARTE (ADAUGĂ ASTA) ---
router.get('/reports/timeline', adminController.getReportTimeline);
router.get('/reports/categories', adminController.getReportCategories);
router.get('/reports/faculties', adminController.getReportFaculties);

module.exports = router;