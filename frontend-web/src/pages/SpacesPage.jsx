import React from 'react';
import { Link } from 'react-router-dom';
import NavigationBar from '../Components/NavigationBar.jsx'; // Import NavigationBar
import Footer from '../Components/Footer.jsx'; // Import Footer
import { SpaceShowcase } from '../Components/SpaceShowcase.jsx'; // Corrected import path for SpaceShowcase

const SpacesPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavigationBar />
      <section className="px-12 py-8 bg-white">
        <h1 className="text-4xl font-bold font-poppins mb-8">Explore Our Study Spaces</h1>
        <p className="text-lg text-gray-700 font-poppins leading-relaxed mb-8">
          Discover a variety of study spaces to fit your needs. Whether you're looking for a quiet corner for focused work or a collaborative environment for group projects, we have options for you.
        </p>
      </section>
      <SpaceShowcase />
      <Footer />
    </div>
  );
};

export default SpacesPage;