import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const mentor = "Mentor";
const mentee = "Mentee";

const Navigation = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };
  const toggleLoginMenu = () => {
    setShowLogin(!showLogin);
  };
  
  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="logo">Seamless Connect</div>
        <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
          <a href="/">Home</a>
          <a href="#calendar">Calender</a>
          <a href="#resources">Resources</a>
          <a href="#about">About</a>
          <a href="#login" onClick={toggleLoginMenu}>Login/Signup</a>
          {showLogin && (
            <div className='login'>
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
      
      {/* Body */}
      <main className="main">
        <section className="hero">
          <div className="description">
            <h1>What is <b>Seamless Connect?</b></h1>
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptas earum nostrum itaque magnam similique laudantium aliquam molestiae ipsam quas voluptates atque architecto sed ea enim eos fugiat, quasi vitae velit corporis reprehenderit minus libero facilis adipisci. Blanditiis facilis sed impedit sunt ad, maxime explicabo inventore doloribus molestias minima nostrum porro dolores totam eaque possimus eos aspernatur molestiae tenetur rerum! Fuga accusamus cum ratione aperiam itaque, iure magnam officia illum, consectetur odit, ad labore sunt quibusdam recusandae expedita velit dolorum nesciunt. Reprehenderit similique nobis nihil dignissimos enim, tempora modi recusandae provident impedit tempore perferendis, error repellendus? Delectus nisi quibusdam similique minima!</p>
          </div>
          <div className="image">
            <img src="https://www.the-rheumatologist.org/wp-content/uploads/2020/02/mentoringgraphic.jpg" alt="Mentorship" />
          </div>
        </section>

        {/* Search Bar */}
        <section className="search">
          <input type="text" placeholder="Search for categories for mentorship" />
          <button className='searchButton'>Serach <i className="fa fa-search" /></button>
        </section>
        
        {/* Testimonials */}
        <div className="testimonials">
          <h2><b>Testimonials</b></h2>
          <div className="testimonial-cards">
            <div className="testimonial-card">
              <img src="https://th.bing.com/th/id/OIP.G2PX9M2_Qi41AGmczBpodwHaHa?rs=1&pid=ImgDetMain"/>
              <span className='mentorName'>John Cena</span>
              <span>Mathematics Teacher</span>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio numquam praesentium est quod sapiente dignissimos modi vero temporibus blanditiis dolorum quas, consequatur id. Consequatur sint laboriosam minus iure maxime dicta?</p>
            </div>
            <div className="testimonial-card">
              <img src="https://img.freepik.com/premium-photo/friendly-positive-cute-little-white-cartoon-robot-glowing-with-blue-light_9493-23413.jpg" />
              <span className='mentorName'>Jane Smith</span>
              <span>English Teacher</span>
              <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Omnis velit animi odit dignissimos, id fugit soluta aspernatur laboriosam qui nobis.
              </p>
            </div>
            {/* Add more testimonial cards as needed */}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 Seamless Connect. All rights reserved.</p>
        <p>Contact us at: contact@seamlessconnect.com</p>
      </footer>
    </div>
  );
};



export default Navigation;
