import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import { MentorModel, MenteeModel } from './db.js';
import dotenv from 'dotenv';
import { otpSend } from './main.js'; // Ensure otpSend function is properly exported
import { GetCategories } from './fetchCategory.js';
import { GetQuestions } from './fetchQuestions.js';
import { checkAnswers } from './answersCheck.js';
import { Submission } from './submitFiles.js';


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

//docs upload 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Route for registration
app.post('/register/:role', async (req, res) => {
    const role = req.params.role;
    console.log(role);
    const data = req.body;
    try {
        if (role == 'Mentor') {
            console.log(data);
            user = await MentorModel.create(data);
        }
        else if (role == 'Mentee'){
            user = await MenteeModel.create(data);
        }
        else {
            console.log(`Invalid role:'${role}'hello`);
            return res.status(404).json({ message: '404 Page Not Found' });
        }
        if (user) {
            console.log("userCreated")
            otp = otpSend(data);
            otp = otp.toString().padStart(6, '0');
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
