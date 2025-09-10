const mongoose = require('mongoose');

const dispenseLogSchema = new mongoose.Schema({
    dispenseTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['TAKEN_ON_TIME', 'MISSED', 'TAKEN_LATE'],
        required: true
    },
    // Link to the schedule that triggered this log entry
    schedule: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Schedule'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

const DispenseLog = mongoose.model('DispenseLog', dispenseLogSchema);

module.exports = DispenseLog;
