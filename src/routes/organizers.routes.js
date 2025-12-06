const express = require("express");
const router = express.Router();
const organizersController = require("../controllers/organizers.controller");


router.route("/")
    .get(organizersController.getAllOrganizers) 
    .post(organizersController.createOrganizer); 


router.route("/:id")
    .get(organizersController.getOrganizerById) 
    .put(organizersController.updateOrganizer) 
    .delete(organizersController.deleteOrganizer); 

module.exports = router;
