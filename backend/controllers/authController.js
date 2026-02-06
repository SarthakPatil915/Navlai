// ==================== Authentication Controller ==================== //

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { User, OTPVerification } = require('../models');

// Brevo API Configuration
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const SENDER_NAME = 'Navlai';
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || 'noreply@navlai.com';


// Generate OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send Email OTP using Brevo API
const sendEmailOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // 1️⃣ Validate input
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // 2️⃣ Validate Brevo API key
    if (!BREVO_API_KEY) {
      console.error("BREVO_API_KEY is not configured");
      return res.status(500).json({ message: "Email service not configured" });
    }

    // 3️⃣ Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // 4️⃣ Send email via Brevo API
    const emailPayload = {
      to: [{
        email: email,
        name: email.split('@')[0]
      }],
      sender: {
        name: SENDER_NAME,
        email: SENDER_EMAIL
      },
      subject: "Navlai - Email Verification OTP",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Your OTP for email verification is:</p>
          <h1 style="color: #007bff; text-align: center; font-size: 48px; letter-spacing: 5px;">${otp}</h1>
          <p style="color: #666;">This OTP is valid for <strong>10 minutes</strong>.</p>
          <p style="color: #999; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `
    };

    await axios.post(BREVO_API_URL, emailPayload, {
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    // 5️⃣ Save OTP only if email succeeds
    await OTPVerification.create({
      email,
      otp,
      type: "email",
      expiresAt
    });

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Error sending OTP via Brevo:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      return res.status(500).json({ message: "Email service authentication failed" });
    } else if (error.response?.status === 400) {
      return res.status(400).json({ message: "Invalid email address" });
    } else if (error.code === "ECONNREFUSED" || error.message.includes("ECONNREFUSED")) {
      return res.status(503).json({ message: "Email service temporarily unavailable" });
    } else {
      return res.status(500).json({ message: "Failed to send OTP" });
    }
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
