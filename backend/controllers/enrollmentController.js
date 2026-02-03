// ==================== Enrollment Controller ==================== //

const { Enrollment, Event } = require('../models');

// Create Enrollment
const createEnrollment = async (req, res) => {
    try {
        const { eventId, name, age, location, contact } = req.body;
        const userId = req.userId;
        
        // Validate eventId
        if (!eventId) {
            return res.status(400).json({ message: 'Event ID is required' });
        }
        
        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        
        // Check event status
        if (event.status !== 'approved') {
            return res.status(400).json({ message: 'Event is not approved for enrollment' });
        }
        
        // Check if enrollment is closed
        if (event.enrollmentClosed) {
            return res.status(400).json({ message: 'Enrollment is closed for this event' });
        }
        
        // Check if max seats reached
        if (event.enrollments && event.enrollments.length >= event.maxSeats) {
            return res.status(400).json({ message: 'No seats available' });
        }
        
        // Check if already enrolled
        const existingEnrollment = await Enrollment.findOne({ eventId, userId });
        if (existingEnrollment) {
            return res.status(400).json({ message: 'Already enrolled for this event' });
        }
        
        // Handle file upload
        let idProofPath = req.file ? req.file.path : '';
        
        if (!idProofPath) {
            return res.status(400).json({ message: 'ID proof is required' });
        }

        const enrollment = await Enrollment.create({
            eventId,
            userId,
            name,
            age: parseInt(age),
            location,
            contact,
            idProof: idProofPath
        });
        
        // Add enrollment to event
        if (!event.enrollments) {
            event.enrollments = [];
        }
        event.enrollments.push(enrollment._id);
        await event.save();
        
        res.status(201).json({
            message: 'Enrollment successful',
            enrollment
        });
    } catch (error) {
        console.error('Error creating enrollment:', error);
        res.status(500).json({ message: 'Failed to create enrollment' });
    }
};

// Get User's Enrollments
const getUserEnrollments = async (req, res) => {
    try {
        const userId = req.userId;
        
        const enrollments = await Enrollment.find({ userId })
            .populate('eventId', 'title date time area district');
        
        res.json({ enrollments });
    } catch (error) {
        console.error('Error fetching enrollments:', error);
        res.status(500).json({ message: 'Failed to fetch enrollments' });
    }
};

// Get Event Enrollments (for admin)
const getEventEnrollments = async (req, res) => {
    try {
        const { eventId } = req.params;
        
        const enrollments = await Enrollment.find({ eventId })
            .populate('userId', 'name email mobile');
        
        res.json({ enrollments });
    } catch (error) {
        console.error('Error fetching enrollments:', error);
        res.status(500).json({ message: 'Failed to fetch enrollments' });
    }
};

// Approve Enrollment (admin only)
const approveEnrollment = async (req, res) => {
    try {
        const { id } = req.params;
        
        const enrollment = await Enrollment.findByIdAndUpdate(
            id,
            { status: 'approved' },
            { new: true }
        );
        
        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }
        
        res.json({ message: 'Enrollment approved', enrollment });
    } catch (error) {
        console.error('Error approving enrollment:', error);
        res.status(500).json({ message: 'Failed to approve enrollment' });
    }
};

// Reject Enrollment (admin only)
const rejectEnrollment = async (req, res) => {
    try {
        const { id } = req.params;
        
        const enrollment = await Enrollment.findByIdAndUpdate(
            id,
            { status: 'rejected' },
            { new: true }
        );
        
        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }
        
        res.json({ message: 'Enrollment rejected', enrollment });
    } catch (error) {
        console.error('Error rejecting enrollment:', error);
        res.status(500).json({ message: 'Failed to reject enrollment' });
    }
};

module.exports = {
    createEnrollment,
    getUserEnrollments,
    getEventEnrollments,
    approveEnrollment,
    rejectEnrollment
};
