const fs = require('fs');
const path = require('path');
const eventsPath = path.join(__dirname, '../data/events.json'); 
const eventsService = require("../services/events.service");

const getEvents = () => {
    try {
        const data = fs.readFileSync(eventsPath, 'utf8');
        const events = JSON.parse(data);
        return events.map(event => ({
            ...event,
            participants: event.participants || [], 
            registered: event.participants ? event.participants.length : (event.registered || 0)
        }));
    } catch (error) {
        return [];
    }
};

const saveEvents = (events) => {
    fs.writeFileSync(eventsPath, JSON.stringify(events, null, 2));
};


exports.registerForEvent = (req, res) => {
    const eventId = req.params.id;
    const { name, email, studentId } = req.body; 

    if (!name || !email) {
        return res.status(400).json({ message: "Numele și emailul sunt obligatorii pentru înscriere." });
    }

    let events = getEvents();
    const eventIndex = events.findIndex(e => e.id === eventId);

    if (eventIndex === -1) {
        return res.status(404).json({ message: "Evenimentul nu a fost găsit." });
    }

    const event = events[eventIndex];
    const newParticipant = { name, email, studentId: studentId || null, registrationDate: new Date().toISOString() };
    
    
    if (event.maxParticipants && (event.registered >= event.maxParticipants)) {
        return res.status(403).json({ message: "Evenimentul este complet (număr maxim de participanți atins)." });
    }

   
    if (event.participants.some(p => p.email === email)) {
        return res.status(409).json({ message: "Sunteți deja înscris la acest eveniment." });
    }

    
    event.participants.push(newParticipant);
    event.registered = event.participants.length; 
    
   
    saveEvents(events);

    res.status(200).json({ 
        message: "Înscriere reușită!", 
        eventTitle: event.title,
        registeredCount: event.registered
    });
};


exports.getParticipants = (req, res) => {
    const eventId = req.params.id;
    const events = getEvents();
    const event = events.find(e => e.id === eventId);
    
    if (!event) {
        return res.status(404).json({ message: "Evenimentul nu a fost găsit." });
    }
    
   
    res.json({ 
        eventTitle: event.title,
        participants: event.participants
    });
};

exports.createEvent = (req, res) => {
  const event = eventsService.createEvent(req.body);
  res.status(201).json(event);
};

exports.getEvents = (req, res) => {
  const { type, faculty, q } = req.query;
  const events = eventsService.getEvents({ type, faculty, q }); 
  res.json(events);
};


exports.getAllEvents = (req, res) => {
    
    const events = getEvents();
    res.json(events);
};

exports.getEventById = (req, res) => {
    const eventId = req.params.id;
    const events = getEvents();
    const event = events.find(e => e.id === eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
};




exports.getParticipants = (req, res) => {
    const eventId = req.params.id;
    const events = getEvents();
    const event = events.find(e => e.id === eventId);
    
    if (!event) {
        return res.status(404).json({ message: "Evenimentul nu a fost găsit." });
    }
    
    res.json({ 
        eventTitle: event.title,
        participants: event.participants
    });
};
exports.removeParticipant = (req, res) => {
    const eventId = req.params.eventId;
    const participantEmail = req.params.participantEmail;

    let events = getEvents();
    const eventIndex = events.findIndex(e => e.id === eventId);

    if (eventIndex === -1) {
        return res.status(404).json({ message: "Evenimentul nu a fost găsit." });
    }

    const event = events[eventIndex];
    const initialParticipantsLength = event.participants.length;


    event.participants = event.participants.filter(p => p.email.toLowerCase() !== participantEmail.toLowerCase());

    if (event.participants.length === initialParticipantsLength) {
        return res.status(404).json({ message: `Participantul cu emailul ${participantEmail} nu a fost găsit la acest eveniment.` });
    }

   
    event.registered = event.participants.length;
    
    saveEvents(events);

    res.status(200).json({ 
        message: `Participantul ${participantEmail} a fost eliminat cu succes.`, 
        eventTitle: event.title,
        registeredCount: event.registered
    });

exports.registerForEvent = (req, res) => {
    const eventId = req.params.id;
    const { name, email, studentId } = req.body; 

    if (!name || !email) {
        return res.status(400).json({ message: "Numele și emailul sunt obligatorii." });
    }

    const result = eventsService.registerForEvent(eventId, { name, email, studentId });

    if (result.error) {
        if (result.error === "Event not found") return res.status(404).json({ message: "Evenimentul nu a fost găsit." });
        if (result.error === "Event is full") return res.status(403).json({ message: "Evenimentul este complet (număr maxim de participanți atins)." });
        if (result.error === "Participant already registered") return res.status(409).json({ message: "Sunteți deja înscris la acest eveniment." });
    }

    res.status(200).json({ 
        message: "Înscriere reușită!", 
        eventTitle: result.title,
        registeredCount: result.registered
    });
};


};
