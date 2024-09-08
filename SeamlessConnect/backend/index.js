import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { MentorModel, MenteeModel } from './db.js';
import dotenv from 'dotenv';
import { otpSend } from './main.js'; // Ensure otpSend function is properly exported

dotenv.config();

const app = express();
let requestCount = 0;
let otp = undefined;
let user = undefined;

const JWT_SECRET = process.env.JWT_SECRET_KEY_SERVER; // Replace with your actual secret key
const JWT_EXPIRATION = '7d'; // Token expiry time

app.use(cors());
app.use(express.json());
app.use(cookieParser()); // Initialize cookie parser middleware

app.use((req, res, next) => {
    requestCount++;
    console.log(`Request Count: ${requestCount}`);
    next();
});

// Function to generate a JWT token
const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid Token' });
        }
        req.user = decoded; // Attach the decoded user to the request object
        next();
    });
};

// Route for registration
app.post('/register/:role', async (req, res) => {
    const role = req.params.role;
    const data = req.body;

    let Model;
    if (role === 'Mentor') {
        Model = MentorModel;
    } else if (role === 'Mentee') {
        Model = MenteeModel;
    } else {
        return res.status(404).json({ message: '404 Page Not Found' });
    }

    try {
        user = await Model.create(data);

        if (user) {
            otp = otpSend(data).padStart(6, '0');
            return res.status(200).json({ message: 'Registration successful, OTP sent', otp });
        }
    } catch (error) {
        console.error('Registration Error:', error.message);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Route for OTP verification
app.post('/register/:role/verification', (req, res) => {
    const { receivedOTP } = req.body;
    if (otp === receivedOTP) {
        const token = generateToken(user);
        res.cookie('authToken', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // Cookie expires in 7 days
        return res.status(200).json({ message: 'OTP verified successfully' });
    } else {
        return res.status(400).json({ message: 'Invalid OTP' });
    }
});

// Example protected route
app.get('/mentortest', verifyToken, (req, res) => {
    res.status(200).json({ message: 'You have access to this route', user: req.user });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
