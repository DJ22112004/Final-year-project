    const DispenseLog = require('../models/dispenseLog.model');

    // @desc    Get all dispense logs for the logged-in user
    // @route   GET /api/logs
    // @access  Private
    const getLogs = async (req, res) => {
        try {
            // Find logs for the user and sort by the most recent
            const logs = await DispenseLog.find({ user: req.user.id })
                .sort({ dispenseTime: -1 })
                .populate('schedule', 'time dosage') // Optionally get schedule details
                .populate('medication', 'name'); // Optionally get medication details

            res.json(logs);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    };

    // Note: In a real-world scenario, the addLog function would likely be a separate,
    // secure endpoint called by the ESP32 hardware, not the user's app.
    // We will simulate log creation when alerts are triggered.

    module.exports = {
        getLogs,
    };
    
