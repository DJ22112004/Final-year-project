    const express = require('express');
    const router = express.Router();
    const { getLogs } = require('../controllers/log.controller');
    const { protect } = require('../middleware/auth.middleware');

    // This route is protected and will only return logs for the authenticated user.
    router.route('/').get(protect, getLogs);

    module.exports = router;
    
