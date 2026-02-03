// ==================== Auth Routes ==================== //

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/auth');

// Public routes
router.post('/send-email-otp', authController.sendEmailOTP);
router.post('/send-mobile-otp', authController.sendMobileOTP);
router.post('/verify-otp', authController.verifyOTP);
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;
