import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { MentorModel, MenteeModel } from './db.js';
import { otpSend } from './main.js';
// import { GetCategories } from './fetchCategory.js';
// import { GetQuestions } from './fetchQuestions.js';
// import { checkAnswers } from './answersCheck.js';
// import { Submission } from './submitFiles.js';

dotenv.config();

const app = express();
let requestCount = 0;
let otpStore = {}; // Replace global otp and tempUserData with session-based store

const JWT_SECRET = process.env.JWT_SECRET_KEY_SERVER;
const JWT_EXPIRATION = '7d'; // Token expiry time

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Middleware to count requests
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
    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid Token' });
        req.user = decoded; 
        next();
    });
};

// Multer storage for document uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './uploads'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

// Add file type and size validation (optional)
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Invalid file type. Only JPG, PNG, and PDF files are allowed.'));
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
});

// Route for registration
app.post('/register/:role', async (req, res) => {
    const { role } = req.params;
    const { firstName, lastName, emailID, phoneNO, hashedPassword } = req.body;

    try {
        if (role === 'Mentor' || role === 'Mentee') {
            const otp = await otpSend(req.body); // Await the resolved OTP
            otpStore[emailID] = {
                otp: otp.toString().padStart(6, '0'), // Convert the OTP to a string after it's resolved
                tempUserData: { firstName, lastName, emailID, phoneNO, hashedPassword, role },
                createdAt: Date.now()
            };
            console.log(otpStore);
            return res.status(200).json({ message: 'OTP sent successfully' });
        } else {
            return res.status(404).json({ message: 'Invalid role' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Registration failed', error: error.message });
    }
});


// Route to resend OTP
app.post('/resendotp',async (req, res) => {
    const { emailID } = req.body;

    if (!otpStore[emailID]) return res.status(400).json({ message: 'No pending registration found' });

    try {
        otpStore[emailID].otp = await otpSend(req.body).toString().padStart(6, '0');
        otpStore[emailID].createdAt = Date.now(); // Update OTP timestamp
        return res.status(200).json({ message: 'OTP sent successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Error in sending OTP', error: err.message });
    }
});

// Route for OTP verification and saving user data
// Route for OTP verification and saving user data
app.post('/register/:role/verification', async (req, res) => {
    const { userOtp, emailID } = req.body; // Ensure 'userOtp' is correctly sent by the client
    const userOtpData = otpStore[emailID];
    console.log(userOtp);
    console.log(userOtpData);
    if (!userOtpData) {
        return res.status(400).json({ message: 'No pending registration found' });
    }

    const { otp, tempUserData, createdAt } = userOtpData;

    if (Date.now() - createdAt > 300000) { // 5-minute expiration time for OTP
        delete otpStore[emailID]; // Clean up expired data
        return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }

    if (otp === userOtp) {
        try {
            let user;
            const { role, firstName, lastName, emailID, phoneNO, hashedPassword } = tempUserData;

            if (role === 'Mentor') {
                user = await MentorModel.create({ firstName, lastName, emailID, phoneNO, hashedPassword });
            } else if (role === 'Mentee') {
                user = await MenteeModel.create({ firstName, lastName, emailID, phoneNO, hashedPassword });
            }

            const token = generateToken(user);
            res.cookie('authToken', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // Cookie expires in 7 days

            delete otpStore[emailID]; // Clear OTP store after successful registration
            return res.status(200).json({ message: 'OTP verified successfully, user registered', token });
        } catch (error) {
            return res.status(500).json({ message: 'Error saving user data', error: error.message });
        }
    } else {
        return res.status(400).json({ message: 'Invalid OTP' });
    }
});

app.get('/categories', verifyToken,async (req, res) => {
    const categories = await GetCategories.find({});
    if(categories) {
        return res.status(200).json({ categories });
    }
    return res.status(500).json({error: "Unable to fetch questions"});
});

app.post('/submitanswers/:category', verifyToken, async (req, res) => {
    try {
        const submittedAnswers = req.body.answers;
        const correctAnswers = await checkAnswers(req.params.category);

        let points = 0;
        submittedAnswers.forEach(answer => {
            const correctAnswer = correctAnswers.find(element => element.questionId === answer.questionID);
            if (correctAnswer && answer.selectedOption === correctAnswer.correctOption) {
                points += 1;
            }
        });
        return res.status(200).json({ score: points });
    } catch (error) {
        console.error('Error submitting answers:', error);
        return res.status(500).json({ error: "Unable to submit answers" });
    }
});



app.get('/getquestions/:category', verifyToken,async (req, res) => {
    const getquestions = await GetQuestions(req.params.category);
    if(getquestions) {
        return res.status(200).json({questions: getquestions});
    }
    return res.status(500).json({error: "Unable to fetch questions"});
});

app.post('/submitdocs', upload.fields([
    { name: 'idCard', maxCount: 1 },
    { name: 'certification', maxCount: 1 },
]), verifyToken, async (req, res) => {
    try {
        const { profileUrl, education, experience, additionalCertificates } = req.body;
        
        const newSubmission = new Submission({
            idCardPath: req.files['idCard'] ? req.files['idCard'][0].path : '',
            certificationPath: req.files['certification'] ? req.files['certification'][0].path : '',
            profileUrl,
            education,
            experience,
            additionalCertificates,
        });

        await newSubmission.save(); // Save submission to the database

        return res.status(200).json({ message: 'Documents submitted successfully!' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'internal error'})
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    return res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
