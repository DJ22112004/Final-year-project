const mongoose = require('mongoose');

const dispenserSchema = new mongoose.Schema({
    deviceId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'error'],
        default: 'inactive'
    },
    // Establishes a relationship to the User model
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

const Dispenser = mongoose.model('Dispenser', dispenserSchema);

module.exports = Dispenser;
