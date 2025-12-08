const fs = require('fs');
const path = require('path');
const eventsPath = path.join(__dirname, '../data/events.json');
const notificationService = require('./notification.service');

const getEventsData = () => {
    try {
        const data = fs.readFileSync(eventsPath, 'utf8');
        return JSON.parse(data);
    } catch (error) { return []; }
};

const saveEventsData = (events) => {
    fs.writeFileSync(eventsPath, JSON.stringify(events, null, 2));
};

exports.getAllEvents = () => getEventsData();

exports.getEvents = (filters) => {
    let result = getEventsData();
    if (filters.type) result = result.filter(e => e.type.toLowerCase() === filters.type.toLowerCase());
    if (filters.faculty) result = result.filter(e => e.faculty.toLowerCase().includes(filters.faculty.toLowerCase()));
    if (filters.q) {
        const q = filters.q.toLowerCase();
        result = result.filter(e => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q));
    }
    return result;
};

// MODIFICARE: parseInt(id) pentru că acum ID-ul e număr
exports.getEventById = (id) => {
    return getEventsData().find(e => e.id === parseInt(id));
};

// MODIFICARE: Adăugare câmpuri noi și generare ID numeric
exports.createEvent = (data) => {
    const events = getEventsData();
    
    // Generăm ID numeric (Max ID + 1)
    const maxId = events.length > 0 ? Math.max(...events.map(e => e.id)) : 0;
    const newId = maxId + 1;

    const newEvent = {
        id: newId, 
        title: data.title,
        description: data.description,
        type: data.type,
        faculty: data.faculty,
        department: data.department || "",  // Câmp nou
        location: data.location,
        date: data.date,
        startTime: data.startTime,          // Câmp nou
        endTime: data.endTime || "",        // Câmp nou
        maxParticipants: parseInt(data.maxParticipants) || 0,
        organizer: data.organizer || "Organizator Anonim",
        status: "PENDING",
        registered: 0,
        participants: [],
        reviews: [],
        image: data.imageUrl || null
    };
    
    events.push(newEvent);
    saveEventsData(events);
    return newEvent;
};

// MODIFICARE: parseInt(eventId)
exports.registerForEvent = (eventId, participantData) => {
    let events = getEventsData();
    const eventIndex = events.findIndex(e => e.id === parseInt(eventId)); // <--- Aici

    if (eventIndex === -1) return { error: "Event not found" };

    const event = events[eventIndex];

    if (event.maxParticipants && (event.registered >= event.maxParticipants)) {
        return { error: "Event is full" };
    }
    if (event.participants.some(p => p.email.toLowerCase() === participantData.email.toLowerCase())) {
        return { error: "Participant already registered" };
    }

    const ticketCode = `QR-${eventId}-${Date.now()}`;
    const newParticipant = { 
        ...participantData, 
        ticketCode, 
        isCheckedIn: false, 
        registrationDate: new Date().toISOString() 
    };

    event.participants.push(newParticipant);
    event.registered = event.participants.length;
    saveEventsData(events);

    notificationService.sendRegistrationConfirmation(participantData.email, event.title);
    return { success: true, ticket: newParticipant, ...event };
};

exports.getParticipants = (eventId) => {
    const event = getEventsData().find(e => e.id === parseInt(eventId)); // <--- Aici
    if (!event) return { error: "Event not found" };
    return event.participants;
};

exports.updateEventStatus = (id, status) => {
    let events = getEventsData();
    const event = events.find(e => e.id === parseInt(id)); // <--- Aici
    if (event) {
        event.status = status;
        saveEventsData(events);
        return event;
    }
    return null;
};

exports.checkInByQR = (qrCodeString) => {
    let events = getEventsData();
    for (let event of events) {
        if (!event.participants) continue;
        const pIndex = event.participants.findIndex(p => p.ticketCode === qrCodeString);
        if (pIndex !== -1) {
            if (event.participants[pIndex].isCheckedIn) return { success: false, message: "Check-in deja efectuat." };
            event.participants[pIndex].isCheckedIn = true;
            saveEventsData(events);
            return { success: true, student: event.participants[pIndex].name, eventTitle: event.title };
        }
    }
    return { success: false, message: "Bilet invalid." };
};