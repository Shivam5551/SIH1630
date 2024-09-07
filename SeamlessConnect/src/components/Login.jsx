// login.jsx
import googleLogo from '../assets/google-logo.png'; // Replace with the actual path
import digilockerLogo from '../assets/digilocker-logo.png'; // Replace with the actual path
import React from 'react';
import { Link, useParams } from 'react-router-dom';



const Login = () => {

  const { role } = useParams();

  const submit = () => {
    // Handle form submission here
    console.log('Login button clicked');
  };

  return (
    <div className="centered-container">
        <div className="loginPage">
            <h1 className="heading">{role} Login</h1>
            <input id="email/username" type="text" placeholder="Username/Email" />
            <input id="password" type="password" placeholder="Password" />
            <button type="button" className='loginButton' onClick={submit}>Login</button>
            <a className="forgotPassword" href="#forgotPassword">Forgot Password?</a>
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
            <Link to={`/register/${role}`}><button type="button" className="registerButton">Register</button></Link>
        </div>
    </div>
  );
};

export default Login;
