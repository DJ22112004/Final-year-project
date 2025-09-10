const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    time: {
        type: String, // Storing as HH:MM string for simplicity
        required: true
    },
    dosage: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    // Relationships to other models
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    dispenser: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Dispenser'
    },
    medication: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Medication'
    }
}, {
    timestamps: true
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
