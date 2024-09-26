/* eslint-disable no-unused-vars */
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login'; 
import Home from './components/Home'; 
import Signup from './components/Signup'
import OtpVerification from './components/Verification';
import Test from './components/Test'
import SubmitDocs from './components/SubmitDocs';
import { Failed } from './components/Falied';
import NotEligible from './components/NotEligible';
import WaitingPage from './components/VerificationWaitingPage';
import './App.css';
import MentorRegistration from './components/MentorRegistration';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/:role" element={<Login/>} />
        <Route path='/register/:role' element={<Signup/>} />
        <Route path='/register/:role/verification' element={<OtpVerification/>}/>
        <Route path='/mentorTest' element={<Test/>}/>
        <Route path='/submitdocs' element={<SubmitDocs/>}/>
        <Route path='/failed' element={<Failed/>}/>
        <Route path='/noteligible' element={<NotEligible/>}/>
        <Route path='/verification/waitingpage' element={<WaitingPage/>}/>
        <Route path='/mentorverification' element={<MentorRegistration/>}/>
      </Routes>
    </Router>
  );
};

export default App;
