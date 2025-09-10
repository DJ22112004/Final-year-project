    const Medication = require('../models/medication.model');

    // @desc    Get all medications for the logged-in user
    // @route   GET /api/medications
    // @access  Private
    const getMedications = async (req, res) => {
        try {
            const medications = await Medication.find({ user: req.user.id });
            res.json(medications);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    };

    // @desc    Create a new medication
    // @route   POST /api/medications
    // @access  Private
    const addMedication = async (req, res) => {
        const { name, sifterDiscType } = req.body;

        if (!name || !sifterDiscType) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        try {
            const medication = new Medication({
                name,
                sifterDiscType,
                user: req.user.id
            });

            const createdMedication = await medication.save();
            res.status(201).json(createdMedication);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    };

    module.exports = {
        getMedications,
        addMedication,
    };
    
