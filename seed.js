// seed.js

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); 

// ************************************************************
// 1. IMPORTURI DE MODEL ȘI CONFIGURARE
// ************************************************************

// Ajustează calea către modele, dacă este necesar
const Organizer = require('./src/models/Organizer');
const User = require('./src/models/User'); 
const Event = require('./src/models/Event'); 

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventManagementDB'; 

// Cale de bază către directorul de date
const dataDir = path.join(__dirname, 'src', 'data');


// ************************************************************
// 2. FUNCȚIA DE AJUTOR PENTRU CITIREA FIȘIERELOR
// ************************************************************

const readJsonFile = (filename) => {
    const filePath = path.join(dataDir, filename);
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
};


// ************************************************************
// 3. FUNCȚIA PRINCIPALĂ DE IMPORT
// ************************************************************

const importData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Conectat la MongoDB pentru seeding.");

        // 3.1 Șterge datele vechi (pentru o bază de date curată)
        await Organizer.deleteMany();
        await User.deleteMany();
        await Event.deleteMany();
        console.log("🗑️ Datele vechi au fost șterse.");


        // 3.2 CITIREA DATELOR DIN FIȘIERELE JSON
        
        // Citirea organizatorilor
        let organizerData = readJsonFile('organizers.json');
        
        // Citirea utilizatorilor
        let userData = readJsonFile('users.json');

        // Citirea evenimentelor
        let eventData = readJsonFile('events.json');

        
        // 3.3 INSERAREA ORGANIZATORILOR ȘI UTILIZATORILOR
        
        // Inserează organizatorii
        const organizers = await Organizer.insertMany(organizerData);
        console.log(`🎉 ${organizers.length} organizatori adăugați din JSON!`);

        // Inserează utilizatorii
        const users = await User.insertMany(userData);
        console.log(`🧑‍💻 ${users.length} utilizatori adăugați din JSON!`);


        // 3.4 MAPAREA ȘI INSERAREA EVENIMENTELOR
        
        // Preia ID-ul primului organizator creat (pentru a lega evenimentele)
        const firstOrganizerId = organizers.length > 0 ? organizers[0]._id : null; 

        if (firstOrganizerId) {
            // Modifică evenimentele: Suprascrie vechiul organizerId cu noul ID valid
            eventData = eventData.map(event => ({
                ...event,
                organizerId: firstOrganizerId 
            }));
            
            // Inserează evenimentele modificate
            const events = await Event.insertMany(eventData);
            console.log(`🎊 ${events.length} evenimente adăugate și mapate cu succes!`);
        } else {
            console.warn("⚠️ Nu s-au găsit organizatori. Evenimentele nu au putut fi legate.");
        }
        
        
    } catch (error) {
        // Dacă eroarea este de validare sau de citire a fișierului
        console.error("❌ EROARE LA SEEDING:", error.message);
        console.log("\nAsigură-te că:");
        console.log("1. Ai fișierele events.json, organizers.json, users.json în src/data/.");
        console.log("2. Datele din fișiere respectă schemele Mongoose (câmpuri Required, Enum, etc.).");
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log("🔌 Conexiunea la baza de date închisă.");
    }
};


// ************************************************************
// 4. RULAREA SCRIPTULUI
// ************************************************************
importData();