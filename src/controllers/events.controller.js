const eventsService = require("../services/events.service");

// GET /events
exports.getEvents = (req, res) => {
    const { type, faculty, q } = req.query;
    try {
        const events = eventsService.getEvents({ type, faculty, q });
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /events/:id
exports.getEventById = (req, res) => {
    const event = eventsService.getEventById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
};

// POST /events
exports.createEvent = (req, res) => {
    try {
        const event = eventsService.createEvent(req.body);
        res.status(201).json(event);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /events/:id/register
exports.registerForEvent = (req, res) => {
    const eventId = req.params.id;
    const { name, email, studentId } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: "Numele și emailul sunt obligatorii." });
    }

    const result = eventsService.registerForEvent(eventId, { name, email, studentId });

    if (result.error) {
        if (result.error === "Event not found") return res.status(404).json({ message: "Evenimentul nu a fost găsit." });
        if (result.error === "Event is full") return res.status(403).json({ message: "Evenimentul este complet." });
        if (result.error === "Participant already registered") return res.status(409).json({ message: "Sunteți deja înscris." });
        return res.status(500).json({ message: result.error });
    }

    res.status(200).json({
        message: "Înscriere reușită!",
        ticket: result.ticket
    });
};

// GET /events/:id/participants
exports.getParticipants = (req, res) => {
    const event = eventsService.getEventById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    
    res.json({
        eventTitle: event.title,
        participants: event.participants || []
    });
};