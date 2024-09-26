/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const OtpVerification = () => {
    const navigate = useNavigate();
    const { role } = useParams();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isValid, setIsValid] = useState(true);
    const [isResending, setIsResending] = useState(false);
    const [resendMessage, setResendMessage] = useState('');
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        const storedFormData = localStorage.getItem('formData');
        if (storedFormData) {
            setFormData(JSON.parse(storedFormData));
        } else {
            navigate('/failed');
        }
    }, [navigate]);
    
    const handleChange = (e, index) => {
        const newOtp = [...otp];
        newOtp[index] = e.target.value;

        // Auto-focus the next input
        if (e.target.value.length === 1 && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }

        setOtp(newOtp);
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            e.preventDefault();
            const newOtp = [...otp];
            newOtp[index] = '';

            // Move focus to the previous input
            if (index > 0) {
                document.getElementById(`otp-${index - 1}`).focus();
            }

            setOtp(newOtp);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
    
        if (otpString.length === 6) {
            setIsValid(true);
    
            // Call API to verify OTP
            try {
                const response = await fetch(`http://localhost:3000/register/${role}/verification`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userOtp: otpString, emailID: formData.emailID })
                });
                
                const data = await response.json();
    
                if (response.ok) {
                    if (data.token) {
                        localStorage.setItem('cookie', data.token);
                    }
                    if(role === "Mentor") {
                        navigate(`/mentorverification`)
                    }
                    else if (role === "Mentee") {
                        navigate(`/dashboard`)
                    }
                    else {
                        navigate(`/failed`)
                    }
                } else {
                    setIsValid(false);
                    setResendMessage(data.message || 'Failed to verify OTP.');
                    console.log('Response Error Data:', data); // Log the error data
                }
            } catch (error) {
                console.error('Error during OTP verification:', error);
                setIsValid(false);
                setResendMessage('An error occurred. Please try again later.');
            }
        } else {
            setIsValid(false);
        }
    };

    const handleResendOtp = async () => {
        setIsResending(true);
        setResendMessage('');
        try {
            const response = await fetch('http://localhost:3000/resendotp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ emailID: formData.emailID }),
            });
            const data = await response.json();
            if (response.ok) {
                setResendMessage('OTP sent successfully.');
            } else {
                setResendMessage(data.message || 'Error resending OTP.');
            }
        } catch (error) {
            setResendMessage('Error resending OTP.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="otp-container">
            <div className="main-otp-container">
                <h2>OTP Verification</h2>
                <p>Your OTP has been sent to your email address.</p>
                <form onSubmit={handleSubmit}>
                    <div className="otp-inputs">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                value={digit}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                maxLength="1"
                                className="otp-input"
                            />
                        ))}
                    </div>
                    {!isValid && <p className="error-message">Please enter a valid 6-digit OTP.</p>}
                    <div className="button-container">
                        <button 
                            type="button" 
                            onClick={handleResendOtp} 
                            disabled={isResending} 
                            className="submit-button"
                        >
                            {isResending ? 'Resending...' : 'Resend OTP'}
                        </button>
                        <button type="submit" className="submit-button">Verify</button>
                    </div>
                </form>
                
                {resendMessage && <p className="error-message">{resendMessage}</p>}
            </div>
        </div>
    );
};

export default OtpVerification;
