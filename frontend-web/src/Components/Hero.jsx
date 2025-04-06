import React, { useState } from 'react';

export const Hero = () => {
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


export default Hero;