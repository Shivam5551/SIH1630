import React, { useState } from 'react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { getCountries, getCountryCallingCode } from 'libphonenumber-js';
import backgroundImage from '../assets/background-image.png';
import googleLogo from '../assets/google-logo.png'; // Replace with the actual path
import digilockerLogo from '../assets/digilocker-logo.png'; // Replace with the actual path

const countries = getCountries().map(country => ({
  code: country,
  callingCode: getCountryCallingCode(country),
}));

const CustomCountrySelect = ({ value, onChange }) => {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {countries.map(({ code, callingCode }) => (
        <option key={code} value={code}>
          {callingCode} ({code})
        </option>
      ))}
    </select>
  );
};

const Signup = () => {
  const [value, setValue] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');

  const handleGeneratePassword = () => {
    const newPassword = generateRandomPassword();
    setGeneratedPassword(newPassword);
  };

  const generateRandomPassword = (length = 12) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };

  const handleChange = (phoneNumber) => {
    setValue(phoneNumber);
    if (phoneNumber && !isValidPhoneNumber(phoneNumber)) {
      // Optionally handle invalid phone numbers
      console.log('Invalid phone number');
    }
  };

  const submit = () => {
    // Handle form submission here
    console.log('Register button clicked');
  };

  return (
    <div className="signup-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="signup-form">
        <div className="name">
          <input id="firstName" required placeholder="First Name" type="text" />
          <input id="lastName" placeholder="Last Name" type="text" />
        </div>
        <input className="email-id" required placeholder="Email" type="email" />
        <PhoneInput
          defaultCountry="US"
          value={value}
          onChange={handleChange}
          placeholder="Enter phone number"
          countrySelectComponent={(props) => <CustomCountrySelect {...props} />}
        />
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={generatedPassword}
          readOnly
        />
        <input
          id="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={generatedPassword}
          readOnly
        />
        <div className="but"  
        <div className="social-buttons">
            <button type="button" className="google-button">
                <img src={googleLogo} alt="Google Logo" className="social-logo" />
                Login using Google
            </button>
            <button type="button" className="digilocker-button">
                <img src={digilockerLogo} alt="Digilocker Logo" className="social-logo" />
                Login Using Digilocker
            </button>
            </div>
      </div>
    </div>
  );
};

export default Signup;
