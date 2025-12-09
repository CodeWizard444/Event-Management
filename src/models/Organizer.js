// src/models/Organizer.js
const mongoose = require('mongoose');

const organizerSchema = new mongoose.Schema({
    // MongoDB va genera automat _id
    name: {
        type: String,
        required: true,
        unique: true, // Numele organizației este unic
        trim: true
    },
    email: { // Email-ul de contact al organizației
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    contactPerson: { // Persoana de contact din cadrul organizației
        type: String,
        required: true
    },
    eventsOrganized: { // Acest câmp va fi menținut momentan, deși în MongoDB poate fi calculat
        type: Number,
        default: 0
    }
}, { 
    timestamps: true 
}); 

// Mongoose va crea colecția 'organizers'
const Organizer = mongoose.model('Organizer', organizerSchema);
module.exports = Organizer;