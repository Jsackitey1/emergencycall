const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Update user location
router.post('/update-location', async (req, res) => {
    try {
        const { userId, latitude, longitude } = req.body;
        await User.findByIdAndUpdate(userId, { location: { latitude, longitude } });
        res.json({ message: "Location updated successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get nearby users (within 5km radius)
router.get('/nearby/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found!" });

        const users = await User.find({
            _id: { $ne: userId }
        });

        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;