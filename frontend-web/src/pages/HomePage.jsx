// HomePage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/homepage.css';

// Import your images here
// import heroImage from './assets/hero-image.jpg';
// import space1 from './assets/space1.jpg';
// etc.

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };
  
  // Sample featured spaces data (would come from API in real app)
  const featuredSpaces = [
    {
      id: 1,
      name: 'Focus Studio',
      location: 'Downtown',
      price: '$15/hour',
      rating: 4.8,
      image: 'space1.jpg',
    },
    {
      id: 2,
      name: 'Collaboration Hub',
      location: 'Midtown',
      price: '$20/hour',
      rating: 4.6,
      image: 'space2.jpg',
    },
    {
      id: 3,
      name: 'Quiet Zone',
      location: 'University District',
      price: '$12/hour',
      rating: 4.9,
      image: 'space3.jpg',
    },
    {
      id: 4,
      name: 'Creative Commons',
      location: 'Arts District',
      price: '$18/hour',
      rating: 4.7,
      image: 'space4.jpg',
    },
  ];
  
  return (
    <div className="homepage">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/">StudySpace</Link>
        </div>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/spaces">Spaces</Link>
          <Link to="/how-it-works">How It Works</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="navbar-auth">
          <Link to="/login" className="login-button">Login</Link>
          <Link to="/register" className="register-button">Register</Link>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Find Your Perfect Study Space</h1>
          <p>Book desks, private rooms, and meeting spaces on demand</p>
          
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Enter location or zip code"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
          
          <div className="quick-filters">
            <button className="filter-button">Desks</button>
            <button className="filter-button">Private Rooms</button>
            <button className="filter-button">Meeting Spaces</button>
          </div>
        </div>
      </section>
      
      {/* Featured Spaces Section */}
      <section className="featured-section">
        <div className="section-header">
          <h2>Featured Study Spaces</h2>
          <Link to="/spaces" className="view-all">View All Spaces</Link>
        </div>
        
        <div className="space-grid">
          {featuredSpaces.map((space) => (
            <div className="space-card" key={space.id}>
              <div className="space-image">
                {/* Replace with actual image in production */}
                <div className="placeholder-image" style={{backgroundColor: '#9090EB'}}></div>
              </div>
              <div className="space-info">
                <h3>{space.name}</h3>
                <p className="space-location">{space.location}</p>
                <div className="space-details">
                  <span className="space-price">{space.price}</span>
                  <span className="space-rating">★ {space.rating}</span>
                </div>
                <Link to={`/spaces/${space.id}`} className="book-button">
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-icon search-icon">1</div>
            <h3>Search</h3>
            <p>Find available spaces with our filters</p>
          </div>
          <div className="step">
            <div className="step-icon book-icon">2</div>
            <h3>Book</h3>
            <p>Reserve your preferred time slot</p>
          </div>
          <div className="step">
            <div className="step-icon study-icon">3</div>
            <h3>Study</h3>
            <p>Enjoy your productive space</p>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonial-grid">
          <div className="testimonial-card">
            <div className="testimonial-rating">★★★★★</div>
            <p>"StudySpace helped me find the perfect quiet corner to finish my thesis. Highly recommended!"</p>
            <div className="testimonial-author">- Sarah K.</div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-rating">★★★★★</div>
            <p>"The booking process is so seamless. I've used it for both solo work and team meetings."</p>
            <div className="testimonial-author">- Michael T.</div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-rating">★★★★☆</div>
            <p>"Great variety of spaces at different price points. Perfect for students on a budget."</p>
            <div className="testimonial-author">- Aisha M.</div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>StudySpace</h3>
            <p>Find and book the perfect study space on demand.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/spaces">Spaces</Link></li>
              <li><Link to="/how-it-works">How It Works</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact</h3>
            <p>Email: info@studyspace.com</p>
            <p>Phone: (123) 456-7890</p>
          </div>
          <div className="footer-section">
            <h3>Legal</h3>
            <ul>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 StudySpace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;