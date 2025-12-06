const notificationService = require('../services/notification.service');
const eventsService = require('../services/events.service'); 


exports.sendEventNotification = async (req, res) => {
    const { eventId, subject, message } = req.body;

    if (!eventId || !subject || !message) {
        return res.status(400).json({ message: "eventId, subject și message sunt obligatorii." });
    }

 
    const event = eventsService.getEventById(eventId);
    if (!event || event.error) {
         return res.status(404).json({ message: "Evenimentul nu a fost găsit." });
    }
    
   
    const recipients = event.participants.map(p => p.email).join(', ');

    if (!recipients) {
        return res.status(400).json({ message: "Acest eveniment nu are participanți înscriși." });
    }

    
    const result = await notificationService.sendNotification(
        recipients, 
        subject, 
        message
    );
    
    if (result.success) {
        res.status(200).json({ 
            message: `Notificare inițiată. Mesajul a fost trimis (simulat) către ${event.participants.length} participanți.`,
            details: result.message
        });
    } else {
        res.status(500).json({ message: "Eroare la inițierea notificării.", details: result.message });
    }
};
