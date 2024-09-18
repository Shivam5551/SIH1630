import React, { useEffect, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import VideoPath from '../assets/bg-video4.mp4';


const mentor = "Mentor";
const mentee = "Mentee";

const headingsWithDescriptions = [
  {
    heading: "Empower Your Journey, One Connection at a Time",
    description: "Make meaningful connections that drive your growth and success. Empower yourself through personalized mentorship."
  },
  {
    heading: "From Aspiration to Achievement with Expert Mentorship",
    description: "Turn your dreams into reality with expert guidance. Achieve your aspirations with effective mentorship."
  }
];

const Navigation = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };
  const toggleLoginMenu = () => {
    setShowLogin(!showLogin);
  };

  const handleMouseEnter = () => {
    setShowLogin(true); 
  };

  const handleMouseLeave = () => {
    setShowLogin(false); 
  };
  
  const handleMouseLeaveMenu = () => {
    setMenuOpen(false);
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % headingsWithDescriptions.length);
    }, 5000); 
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="App">
      {/* Header */}
      <div className='stick-top'>
      <header className="header">
        <div className="logo">Seamless Connect</div>
        <nav className={`nav ${isMenuOpen ? 'open' : ''}`} onMouseLeave={handleMouseLeaveMenu}>
          <a href="/">Home</a>
          <a href="#calendar">Calender</a>
          <a href="#resources">Resources</a>
          <a href="#about">About</a>
          <a href="#login" onClick={toggleLoginMenu}>Login/Signup</a>
          {showLogin && (
            <div
            className='login'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
                <Link to={`/login/${mentor}`}>Login as {mentor}</Link>
                <Link to={`/register/${mentor}`}>Sign up as {mentor}</Link>
                <Link to={`/login/${mentee}`}>Login as {mentee}</Link>
                <Link to={`/register/${mentee}`}>Sign up as {mentee}</Link>
            </div>)}
          <button className="demo" href="#bookDemo">Book a Demo</button>
        </nav>
        <button className="menu-toggle" onClick={toggleMenu}>
          &#x22EE; {/* Triple dot symbol */}
        </button>
      </header>
      </div>
      <hr/>
      {/* Body */}
      <main className="main">
        <section className="hero">
        <video className="bg-video" autoPlay muted loop>
        <source src={VideoPath} type="video/mp4" />
        </video>
          <div className='heading-container'>
            <h1>{headingsWithDescriptions[currentIndex].heading}</h1>
            <p>{headingsWithDescriptions[currentIndex].description}</p>
          </div>
        </section>

      <div className="thq-section-padding">
      <div className="thq-section-max-width">
        <div className="cta26-accent2-bg">
          <div className="cta26-accent1-bg">
            <div className="cta26-container2">
              <div className="cta26-content">
                <span>
                    <Fragment>
                      <span className="cta26-text4 thq-heading-2">
                        Find Your Perfect Mentor
                      </span>
                    </Fragment>
                </span>
                <p>
                  <Fragment>
                      <p className="cta26-text5 thq-body-large">
                        Search through our database of experienced mentors to
                        find the perfect match for your learning needs.
                      </p>
                    </Fragment>
                </p>
              </div>
              <div className="cta26-actions">
                <button
                  type="button"
                  className="cta26-button"
                >
                  <span>
                      <Fragment>
                        <span className="cta26-text6">Start Searching</span>
                      </Fragment>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

        
        {/* Testimonials */}
        <div className="testimonials">
          <h1><b>Testimonials</b></h1>
          <div className="testimonial-cards">
            <div className="testimonial-card">
              <img src="https://th.bing.com/th/id/OIP.hCfHyL8u8XAbreXuaiTMQgHaHZ?rs=1&pid=ImgDetMain"/>
              <span className='mentorName'>Alex Johnson</span>
              <span>Mathematics Mentor</span>
              <p>Alex's expertise in mathematics and his teaching methods are outstanding. His ability to break down complex concepts into understandable segments has greatly improved my understanding and confidence in math</p>
            </div>
            <div className="testimonial-card">
              <img src="https://i.pinimg.com/originals/c7/6b/3f/c76b3f38a6b60c338d6534b4eacc9af2.jpg" />
              <span className='mentorName'>Emily Davis</span>
              <span>English Mentor</span>
              <p>Emily's insights into English literature and grammar have been incredibly helpful. Her personalized feedback and engaging lessons have significantly enhanced my writing skills and appreciation for literature.
              </p>
            </div>
            {/* Add more testimonial cards as needed */}
          </div>
        </div>
      
      </main>
            <hr/>
      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2024 Seamless Connect. All rights reserved.</p>
          <p>Contact us at: <a href="mailto:contact@seamlessconnect.com">contact@seamlessconnect.com</a></p>
          <p>Follow us on:</p>
          <ul className="social-media-links">
            <li><a href="#facebook" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a></li>
            <li><a href="#twitter" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a></li>
            <li><a href="#instagram" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a></li>
            <li><a href="#linkedIn" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a></li>
          </ul>
          <p><a href="#privacy-policy">Privacy Policy</a> | <a href="#terms-of-service">Terms of Service</a></p>
          <p>GTB4CEC Guru Tegh Bahadur 4th Centenary Engineering College</p>
        </div>
      </footer>


    </div>
  );
};



export default Navigation;
