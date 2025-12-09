// src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // MongoDB generează automat un _id
    name: {
        type: String,
        required: true,
        trim: true // Elimină spațiile albe la început și la sfârșit
    },
    email: {
        type: String,
        required: true,
        unique: true, // Asigură că nu există două adrese de email identice
        lowercase: true // Stochează email-ul cu litere mici
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['STUDENT', 'ORGANIZER', 'ADMIN'], // Limitează valorile posibile
        default: 'STUDENT'
    }
}, { 
    timestamps: true // Adaugă câmpurile 'createdAt' și 'updatedAt'
}); 

// Mongoose va crea colecția 'users' (pluralul lui 'User')
const User = mongoose.model('User', userSchema);
module.exports = User;