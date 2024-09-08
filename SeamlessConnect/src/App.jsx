import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login'; 
import Home from './components/Home'; 
import Signup from './components/Signup'
import OtpVerification from './components/Verification';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/:role" element={<Login/>} />
        <Route path='/register/:role' element={<Signup/>} />
        <Route path='/register/:role/verification' element={<OtpVerification/>}/>
      </Routes>
    </Router>
  );
};

export default App;
