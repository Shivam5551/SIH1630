import emailjs from '@emailjs/browser';
import dotenv from 'dotenv';

// Configure dotenv to load the environment variables
dotenv.config();


export const otpSend = (data) => {
    const otp = generateOtp();
    const templateParams = {
        name: data.firstName,
        email: data.emailID, // Email to send OTP
        message: `Your OTP is ${otp}`, 
    };

    emailjs.send(process.env.SERVICE_ID, process.env.PLATFORM_MAIL, templateParams, process.env.PUBLIC_KEY_FOR_MAIL)
        .then((response) => {
            console.log('Email sent successfully:', response.status, response.text);
            return otp;
        })
        .catch((error) => {
            console.error('Failed to send email:', error);
            return error;
        });
};

// Helper function to generate an OTP
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
};