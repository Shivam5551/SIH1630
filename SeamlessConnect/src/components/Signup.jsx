import React, { useState } from 'react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { getCountries, getCountryCallingCode } from 'libphonenumber-js';
import backgroundImage from '../assets/bg-image.png';
import googleLogo from '../assets/google-logo.png'; 
import digilockerLogo from '../assets/digilocker-logo.png'; 
import { Link, useParams } from 'react-router-dom';

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
  const { role } = useParams();

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

  if(role != "Mentor" && role != "Mentee") {
    return (
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <h1>404 Page Not Found</h1>
      </div>
    )
  }

  return (
    <div className="signup-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="signup-form">
        <h1 className="heading" style={{color: 'white', textAlign: 'center'}}>{role} Signup</h1>
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
          <Link to={`/login/${role}`}><button type="button" className="signupToLoginButton">Login</button></Link>
            
      </div>
    </div>
  );
};

export default Signup;
