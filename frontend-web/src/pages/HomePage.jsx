import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NavigationBar from '@/Components/NavigationBar';

// Hero Section Component (No changes needed)
export const HeroSection = () => {
  return (
    <section className="grid grid-cols-2 px-12 py-12">
      <div className="flex flex-col justify-center">
        <h1 className="text-7xl font-md mb-4 font-poppins">Find Your Space</h1>
        <p className="text-lg text-gray-900 mb-4 font-poppins leading-tight max-w-sm">
          Anytime, Anywhere. Discover and book the perfect space for study and work.
        </p>
        <button className="px-6 py-3 w-32 h-14 text-white bg-sky-500 rounded-3xl hover:bg-sky-400 font-poppins">
          Book now
        </button>
      </div>
      <div className="flex justify-center">
        <img
          src="/hero-image.png"
          alt="Students studying"
          className="rounded-lg shadow-md w-full object-cover"
        />
      </div>
    </section>
  );
};

// Featured Spaces Section Component (No changes needed)
export const SpaceShowcase = () => {
  return (
    <section className="px-12 py-8 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-poppins">Featured Spaces</h2>
        <Link to="/spaces" className="text-blue-600 hover:text-blue-800 font-poppins">See all</Link>
      </div>

      <div className="grid grid-cols-3 gap-10 px-4">
        {/* Space Card 1 */}
        <div className="rounded-lg overflow-hidden shadow-md transform scale-95">
          <img src="/space1.png" alt="The Lumina Loft" className="w-full h-max object-cover" />
          <div className="p-3">
            <h3 className="text-2xl font-semibold mb-1 font-poppins">Produktiv</h3>
            <p className="text-gray-500 text-lg font-poppins">Fuente Osmeña • 4.5 (128)</p>
          </div>
        </div>

        {/* Space Card 2 */}
        <div className="rounded-lg overflow-hidden shadow-md transform scale-95">
          <img src="/space2.png" alt="The Lumina Loft" className="w-full h-max object-cover" />
          <div className="p-3">
            <h3 className="text-2xl font-semibold mb-1 font-poppins">The Company CEBU</h3>
            <p className="text-gray-500 text-lg font-poppins">Cebu IT Park • 4.7 (209)</p>
          </div>
        </div>

        {/* Space Card 3 */}
        <div className="rounded-lg overflow-hidden shadow-md transform scale-95">
          <img src="/space3.png" alt="The Lumina Loft" className="w-full h-max object-cover" />
          <div className="p-3">
            <h3 className="text-2xl font-semibold mb-1 font-poppins">WorkNook</h3>
            <p className="text-gray-500 text-lg font-poppins">Ayala Business Park • 4.6 (157)</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Tagline Section Component (No changes needed)
export const TaglineSection = () => {
  return (
    <section className="text-center py-12 px-4 md:px-12 md:w-1/2">
      <div className="max-w-screen-xl mx-auto flex flex-col items-center gap-8">
        <h2 className="text-5xl font-md max-w-lg mx-auto font-poppins text-left">
          When only the best study or work environment will do
        </h2>
      </div>
    </section>
  );
};

// PlatformDescription Section Component (No changes needed)
export const PlatformDescriptionSection = () => {
  return (
    <section className="px-4 md:px-12 py-8 bg-white md:w-1/2">
      {/* Text and Button */}
      <div className="max-w-screen-xl mx-4 flex flex-col justify-center items-center gap-4">
        <div className="md:w-1/2">
          <p className="text-gray-600 mb-4 font-poppins text-2xl">
            From students to teams, see why StudySpace is the leading platform to find and book your ideal space.
          </p>
          <button className="px-6 py-3 w-48 text-white bg-gray-900 rounded-3xl font-poppins">
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
};

// WhyChooseUs Section Component (No changes needed)
export const WhyChooseUsSection = () => {
  return (
    <section className="px-6 py-8">
      <h2 className="text-5xl font-md text-center mb-6 font-poppins">Why people choose StudySpace</h2>
      <div className="flex flex-col md:flex-row gap-x-4 items-start max-w-4xl mx-auto">
        <div className="space-y-5 md:w-1/2 mr-24">
          {/* Feature 1 */}
          <div className="flex flex-col items-center md:items-start max-w-md">
            <div className="mb-2 flex-shrink-0">
              <img src="/point-icon.png" alt="Feature Icon" className="w-10 h-10 rounded-full shadow" />
            </div>
            <div>
              <h3 className="font-sm text-2xl mb-1 font-poppins bg-indigo-200">Find Your Ideal Space, Effortlessly</h3>
              <p className="text-gray-600 text-sm font-poppins">Easily search and compare desks, rooms, and meeting spaces to find the perfect environment for your needs.</p>
            </div>
          </div>
          {/* Feature 2 */}
          <div className="flex flex-col items-center md:items-start max-w-md">
            <div className="mb-2 flex-shrink-0">
              <img src="/lens-icon.png" alt="Feature Icon" className="w-10 h-10 rounded-full shadow" />
            </div>
            <div>
              <h3 className="font-sm text-2xl mb-1 font-poppins bg-indigo-200">Real-Time Availability, Easy Booking</h3>
              <p className="text-gray-600 text-sm font-poppins">See what's available instantly and book your space quickly and conveniently, without any hassle.</p>
            </div>
          </div>
          {/* Feature 3 */}
          <div className="flex flex-col items-center md:items-start max-w-md">
            <div className="mb-2 flex-shrink-0">
              <img src="/shield-icon.png" alt="Feature Icon" className="w-10 h-10 rounded-full shadow" />
            </div>
            <div>
              <h3 className="font-sm text-2xl mb-1 font-poppins bg-indigo-200">Trusted by Students and Teams</h3>
              <p className="text-gray-600 text-sm font-poppins">Join a community of individuals and groups who rely on StudySpace for their study and work needs.</p>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center ml-10">
          <img src="/student-image.png" alt="Student studying" className="rounded-lg shadow-md mb-6 w-96 h-auto" />
        </div>
      </div>
      {/* Testimonials */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-2 max-w-4xl mx-auto">
        <div className="bg-gray-50 p-10 rounded-lg flex flex-col justify-center items-center text-center max-w-sm font-poppins border-gray-900 m-6">
          <p className="text-md text-gray-600 mb-4 font-poppins">"StudySpace has been a lifesaver! Finding a quiet place to focus on my studies used to be so difficult. Now, I can easily find available desks near my university and book them in minutes. It's so convenient!"</p>
          <p className="text-sm text-gray-900 font-medium font-poppins">Darwin Darryl Jean Largoza</p>
        </div>
        <div className="bg-gray-50 p-10 rounded-lg flex flex-col justify-center items-center text-center max-w-sm font-poppins border-gray-900 m-6">
          <p className="text-md text-gray-600 mb-4 font-poppins">"As a freelancer, I don't always want to work from home. StudySpace has opened up a whole new world of co-working spaces for me. I love the variety of options and the ease of booking."</p>
          <p className="text-sm text-gray-900 font-medium font-poppins">Vicci Louise Agramon</p>
        </div>
      </div>
    </section>
  );
};

// Footer Component (No changes needed)
export const Footer = () => {
  return (
    <footer className="bg-blue-50 px-12 py-8 mt-auto">
      <div className="grid grid-cols-4 gap-8">
        <div>
          <h3 className="font-semibold mb-4 font-poppins">StudySpace</h3>
          <p className="text-sm text-gray-600 font-poppins">
            Find and book the perfect study space anywhere.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-4 font-poppins">Quick Links</h3>
          <ul className="space-y-2 text-sm font-poppins">
            <li><Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link></li>
            <li><Link to="/sign-up" className="text-gray-600 hover:text-gray-900">Sign Up</Link></li>
            <li><Link to="/find-a-space" className="text-gray-600 hover:text-gray-900">Find a Space</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4 font-poppins">Contacts</h3>
          <p className="text-sm text-gray-600 font-poppins">Email: info@studyspace.com</p>
          <p className="text-sm text-gray-600 font-poppins">Phone: (123) 456-7890</p>
        </div>

        <div>
          <h3 className="font-semibold mb-4 font-poppins">Legal</h3>
          <ul className="space-y-2 text-sm font-poppins">
            <li><Link to="/terms" className="text-gray-600 hover:text-gray-900">Terms of Service</Link></li>
            <li><Link to="/privacy" className="text-gray-600 hover:text-gray-900">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500 font-poppins">
        &copy; 2025 StudySpace. All rights reserved.
      </div>
    </footer>
  );
};

// Homepage Component using the separated sections
const Homepage = () => {

  return (
    <div className="flex flex-col min-h-screen">
      <NavigationBar />
      
      <HeroSection />
      <SpaceShowcase />
      <div className="flex flex-col md:flex-row">
        <TaglineSection />
        <PlatformDescriptionSection />
      </div>
      <WhyChooseUsSection />
      <Footer />
    </div>
  );
};

export default Homepage;