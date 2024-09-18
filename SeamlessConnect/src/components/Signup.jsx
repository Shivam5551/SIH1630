import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { getCountries, getCountryCallingCode } from 'libphonenumber-js';
import VideoPath1 from '../assets/signupBG.mp4';
import googleLogo from '../assets/google-logo.png'; 
import digilockerLogo from '../assets/digilocker-logo.png'; 
import { Link, useParams } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { Schema } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const countries = getCountries().map(country => ({
  code: country,
  callingCode: getCountryCallingCode(country),
}));

const CustomCountrySelect = ({ value, onChange }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)}>
    {countries.map(({ code, callingCode }) => (
      <option key={code} value={code}>
        {callingCode} ({code})
      </option>
    ))}
  </select>
);

const generateRandomPassword = (length = 12) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

const Signup = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailID: '',
    phoneNO: '',
    password: '',
    confirmPassword: '',
  });

  const { role } = useParams();

  const handleGeneratePassword = () => {
    const newPassword = generateRandomPassword();
    setGeneratedPassword(newPassword);
    setFormData(prevData => ({
      ...prevData,
      password: newPassword,
      confirmPassword: newPassword,
    }));
  };

  const handleChange = (phoneNumber) => {
    setPhoneNumber(phoneNumber);  // Updates local state
    setFormData(prevData => ({ ...prevData, phoneNO: phoneNumber }));  // Updates formData
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({ ...prevData, [id]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prevState => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const submit = async () => {
    const { firstName, lastName, emailID, phoneNO, password, confirmPassword } = formData;

    // Password validation
    if (password !== confirmPassword) {
      alert('Password and Confirm Password must be the same.');
      return;
    }

    if (password.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailID)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (!isValidPhoneNumber(phoneNO)) {
      alert('Invalid phone number.');
      return;
    }

    const hashedPassword = CryptoJS.SHA256(confirmPassword).toString();
    const createPayload = {
      firstName,
      lastName,
      emailID,
      phoneNO: String(phoneNO),
      hashedPassword,
    };

    // Validate the payload with Zod
    const parsed = Schema.safeParse(createPayload);
    if (!parsed.success) {
      const errorMessages = parsed.error.errors.map(err => `${err.path[0]}: ${err.message}`).join(', ');
      alert(`Validation error: ${errorMessages}`);
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:3000/register/${role}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createPayload),
      });

      const data = await response.json();

      if (response.ok && data.message) {
        localStorage.setItem('formData', JSON.stringify(createPayload));
        navigate(`/register/${role}/verification`);
      } else {
        alert(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  if (role !== "Mentor" && role !== "Mentee") {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <h1 style={{ color: "#ccc" }}>404 Page Not Found</h1>
      </div>
    );
  }

  return (
    <div className="signup-container">
      <video className='bg-video' autoPlay loop muted>
        <source src={VideoPath1} type="video/mp4" />
      </video>
      <div className="signup-form">
        <h1 className="heading" style={{ color: 'white', textAlign: 'center' }}>{role} Signup</h1>
        <div className="name">
          <input
            id="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            placeholder="First Name"
            type="text"
          />
          <input
            id="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Last Name"
            type="text"
          />
        </div>
        <input
          className="email-id"
          id="emailID"
          value={formData.emailID}
          onChange={handleInputChange}
          required
          placeholder="Email"
          type="email"
        />
        <PhoneInput
          defaultCountry="US"
          value={formData.phoneNO}
          onChange={handleChange}
          placeholder="Enter phone number"
          countrySelectComponent={(props) => <CustomCountrySelect {...props} />}
        />
        <div className="password-field">
          <input
            className='password'
            id="password"
            type={showPassword.password ? "text" : "password"}
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
          />
          <button type="button" onClick={() => togglePasswordVisibility('password')} className="password-toggle-btn">
            <FontAwesomeIcon icon={showPassword.password ? faEye : faEyeSlash} />
          </button>
        </div>
        <div className="password-field">
          <input
            className='password'
            id="confirmPassword"
            type={showPassword.confirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
          <button type="button" onClick={() => togglePasswordVisibility('confirmPassword')} className="password-toggle-btn">
            <FontAwesomeIcon icon={showPassword.confirmPassword ? faEye : faEyeSlash} />
          </button>
        </div>
        <div className="buttons">
          <button type="button" onClick={handleGeneratePassword}>
            Generate Random Password
          </button>
          <button type="button" className='loginButton' onClick={submit}>Register</button>
        </div>  
        <div className="social-buttons">
          <button type="button" className="google-button">
            <img src={googleLogo} alt="Google Logo" className="social-logo" />
            Signup using Google
          </button>
          <button type="button" className="digilocker-button">
            <img src={digilockerLogo} alt="Digilocker Logo" className="social-logo" />
            Signup Using Digilocker
          </button>
        </div>
        <Link to={`/login/${role}`}><button type="button" className="signupToLoginButton">Already have an Account</button></Link>
      </div>
    </div>
  );
};

export default Signup;
