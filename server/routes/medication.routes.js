    const express = require('express');
    const router = express.Router();
    const { getMedications, addMedication } = require('../controllers/medication.controller');
    const { protect } = require('../middleware/auth.middleware');

    // All routes here are protected
    router.route('/').get(protect, getMedications).post(protect, addMedication);

    module.exports = router;
    
