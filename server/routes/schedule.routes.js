    const express = require('express');
    const router = express.Router();
    const { getSchedules, addSchedule } = require('../controllers/schedule.controller');
    const { protect } = require('../middleware/auth.middleware');

    // All routes in this file are protected and require a valid token
    router.route('/').get(protect, getSchedules).post(protect, addSchedule);

    module.exports = router;
    
