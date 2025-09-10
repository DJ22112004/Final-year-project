    const Schedule = require('../models/schedule.model');
    const Medication = require('../models/medication.model');

    // @desc    Get all schedules for the logged-in user
    // @route   GET /api/schedules
    // @access  Private
    const getSchedules = async (req, res) => {
        try {
            // Find schedules and populate the medication details
            const schedules = await Schedule.find({ user: req.user.id }).populate('medication', 'name sifterDiscType');
            res.json(schedules);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    };

    // @desc    Create a new schedule
    // @route   POST /api/schedules
    // @access  Private
    const addSchedule = async (req, res) => {
        const { medicationId, time, dosage } = req.body;

        if (!medicationId || !time || !dosage) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        try {
            // Check if the medication exists and belongs to the user
            const medication = await Medication.findById(medicationId);
            if (!medication || medication.user.toString() !== req.user.id) {
                return res.status(404).json({ message: 'Medication not found or not authorized' });
            }

            const schedule = new Schedule({
                user: req.user.id,
                medication: medicationId,
                time,
                dosage,
                isActive: true
            });

            const createdSchedule = await schedule.save();
            // Populate medication details in the response
            const populatedSchedule = await Schedule.findById(createdSchedule._id).populate('medication', 'name sifterDiscType');
            res.status(201).json(populatedSchedule);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    };

    module.exports = {
        getSchedules,
        addSchedule,
    };
    
