const fs = require('fs');
const path = require('path');
const organizersPath = path.join(__dirname, '../data/organizers.json');

const getOrganizers = () => {
    try { return JSON.parse(fs.readFileSync(organizersPath, 'utf8')); } 
    catch (error) { return []; }
};
const saveOrganizers = (data) => fs.writeFileSync(organizersPath, JSON.stringify(data, null, 2));

exports.createOrganizer = (req, res) => {
    const organizers = getOrganizers();
    // Generare ID Int
    const maxId = organizers.length > 0 ? Math.max(...organizers.map(o => o.id)) : 0;
    
    const newOrganizer = {
        id: maxId + 1, // ID Numeric
        ...req.body,
        eventsOrganized: 0
    };
    organizers.push(newOrganizer);
    saveOrganizers(organizers);
    res.status(201).json(newOrganizer);
};

exports.getAllOrganizers = (req, res) => res.json(getOrganizers());

exports.getOrganizerById = (req, res) => {
    const organizers = getOrganizers();
    // parseInt pentru parametru
    const organizer = organizers.find(o => o.id === parseInt(req.params.id));
    if (organizer) res.json(organizer);
    else res.status(404).json({ message: "Organizer not found" });
};

exports.updateOrganizer = (req, res) => {
    let organizers = getOrganizers();
    // parseInt pentru parametru
    const index = organizers.findIndex(o => o.id === parseInt(req.params.id));
    if (index !== -1) {
        organizers[index] = { ...organizers[index], ...req.body };
        saveOrganizers(organizers);
        res.json(organizers[index]);
    } else {
        res.status(404).json({ message: "Organizer not found" });
    }
};

exports.deleteOrganizer = (req, res) => {
    let organizers = getOrganizers();
    const initialLength = organizers.length;
    // Filter cu parseInt
    organizers = organizers.filter(o => o.id !== parseInt(req.params.id));
    
    if (organizers.length < initialLength) {
        saveOrganizers(organizers);
        res.status(204).send();
    } else {
        res.status(404).json({ message: "Organizer not found" });
    }
};