// ==================== Authentication Controller ==================== //

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { User, OTPVerification } = require('../models');

// Email Configuration (Update with your credentials)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-password'
    }
});

// Generate OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send Email OTP
const sendEmailOTP = async (req, res) => {
    try {
        const { email } = req.body;
        
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        
        await OTPVerification.create({
            email,
            otp,
            type: 'email',
            expiresAt
        });
        
        // Send email
        await transporter.sendMail({
            to: email,
            subject: 'Navlai - Email Verification OTP',
            html: `<p>Your OTP for email verification is: <strong>${otp}</strong></p>
                   <p>This OTP is valid for 10 minutes.</p>`
        });
        
        res.json({ message: 'OTP sent to email' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
};

// Send SMS OTP (using Twilio)
const sendMobileOTP = async (req, res) => {
    try {
        const { mobile } = req.body;
        
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        
        await OTPVerification.create({
            mobile,
            otp,
            type: 'sms',
            expiresAt
        });
        
        // TODO: Implement Twilio SMS sending
        // For now, we'll just log the OTP
        console.log(`OTP for ${mobile}: ${otp}`);
        
        res.json({ message: 'OTP sent to mobile' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
};

// Register User
const register = async (req, res) => {
    try {
        const { name, email, mobile, password, country, state, district, taluka, area } = req.body;
        
        // Validate required fields
        if (!name || !email || !mobile || !password) {
            return res.status(400).json({ message: 'Name, email, mobile, and password are required' });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        
        // Validate mobile format (10 digits)
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(mobile)) {
            return res.status(400).json({ message: 'Mobile number must be 10 digits' });
        }
        
        // Validate password strength
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' });
        }
        
        // Check if user exists
        const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ message: 'Email already registered' });
            }
            return res.status(400).json({ message: 'Mobile number already registered' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            mobile: mobile.trim(),
            password: hashedPassword,
            country: country || 'India',
            state: state || '',
            district: district || '',
            taluka: taluka || '',
            area: area || '',
            role: 'user'
        });
        
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email or mobile already exists' });
        }
        res.status(500).json({ message: 'Registration failed' });
    }
};

// Login User
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email or mobile
        const user = await User.findOne({
            $or: [{ email }, { mobile: email }]
        });
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // Check password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // Generate JWT
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );
        
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                country: user.country,
                state: user.state,
                district: user.district,
                taluka: user.taluka,
                area: user.area,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed' });
    }
};

// Verify OTP
const verifyOTP = async (req, res) => {
    try {
        const { email, mobile, otp, type } = req.body;
        
        const query = type === 'email' ? { email, type: 'email' } : { mobile, type: 'sms' };
        const otpRecord = await OTPVerification.findOne({ ...query, otp });
        
        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        
        if (otpRecord.expiresAt < new Date()) {
            await OTPVerification.deleteOne({ _id: otpRecord._id });
            return res.status(400).json({ message: 'OTP expired' });
        }
        
        // Delete used OTP
        await OTPVerification.deleteOne({ _id: otpRecord._id });
        
        res.json({ message: 'OTP verified successfully', verified: true });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Failed to verify OTP' });
    }
};

// Get current user info
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ message: 'Failed to get user info' });
    }
};

module.exports = {
    sendEmailOTP,
    sendMobileOTP,
    register,
    login,
    verifyOTP,
    getCurrentUser
};
