const express = require('express');
const User = require('../models/User');

module.exports = (io) => {
    const router = express.Router();

    router.post('/send-alert', async (req, res) => {
        try {
            const { userId, latitude, longitude } = req.body;
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: "User not found!" });

            // Create alert data
            const alertData = {
                username: user.username,
                location: { latitude, longitude },
                message: `🚨 SOS ALERT! 🚨${user.username} needs help!📍 Location: https://www.google.com/maps?q=${latitude},${longitude}`
            };

            // Emit the alert to ALL connected users
            io.emit('sosAlert', alertData);

            res.json({ message: "SOS alert sent!", alertData });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    return router;
};