const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    sifterDiscType: {
        type: String,
        required: true,
        trim: true
    },
    // The user this medication belongs to
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

const Medication = mongoose.model('Medication', medicationSchema);

module.exports = Medication;
