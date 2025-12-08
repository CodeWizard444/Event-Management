const eventsService = require('../services/events.service');

// GET /organizer/stats
exports.getOrganizerStats = (req, res) => {
    // Într-o implementare reală cu JWT, am lua ID-ul din req.user.id
    // Aici simulăm că primim organizerId ca query param sau header pentru testare
    const organizerId = req.query.organizerId; // ex: ?organizerId=u2

    const allEvents = eventsService.getAllEvents();
    const myEvents = allEvents.filter(e => e.organizerId === organizerId); // Asigură-te că ai organizerId în events.json

    const totalParticipants = myEvents.reduce((sum, e) => sum + (e.participants ? e.participants.length : 0), 0);

    res.json({
        totalEvents: myEvents.length,
        totalParticipants: totalParticipants,
        averageParticipants: myEvents.length ? (totalParticipants / myEvents.length).toFixed(2) : 0,
        pendingApproval: myEvents.filter(e => e.status === 'PENDING').length
    });
};

// PATCH /organizer/checkin/:qrCode
exports.checkInParticipant = (req, res) => {
    const { qrCode } = req.params;
    
    // Logica de check-in: Căutăm participantul după codul QR în toate evenimentele
    // QR-ul ar trebui să fie unic (ex: generatedString)
    
    const result = eventsService.checkInByQR(qrCode);

    if (result.success) {
        res.json({ 
            success: true, 
            message: "Check-in realizat!", 
            student: result.student,
            event: result.eventTitle
        });
    } else {
        res.status(404).json({ success: false, message: result.message });
    }
};