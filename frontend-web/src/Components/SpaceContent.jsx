import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const SpaceContent = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  // Mock space images - replace with your actual image sources
  const spaceImages = [
    "/space1.png",
    "/space2.png",
    "/space3.png"
  ];

  // Mock reviews data
  const reviews = [
    {
      name: "Emily Davis",
      date: "2024-01-05",
      rating: 5,
      comment: "The space exceeded my expectations. Very clean and well-maintained."
    },
    {
      name: "Emily Davis",
      date: "2024-01-05",
      rating: 5,
      comment: "The space exceeded my expectations. Very clean and well-maintained."
    },
    {
      name: "Emily Davis",
      date: "2024-01-05",
      rating: 5,
      comment: "The space exceeded my expectations. Very clean and well-maintained."
    }
  ];

  // Mock amenities data
  const amenities = [
    { name: "High-Speed WiFi", available: true },
    { name: "Whiteboard", available: true },
    { name: "Air Conditioning", available: true },
    { name: "Quiet Environment", available: true },
    { name: "Power Outlets", available: true },
    { name: "Coffee Machine", available: true },
    { name: "Private Access", available: true },
    { name: "Natural Lighting", available: true }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Image Carousel with Adjustable Size */}
      <div className="relative mb-4">
        {/* Image container with explicitly defined size */}
        <div className="overflow-hidden relative rounded-t-lg w-full h-96">
          <img 
            src={spaceImages[currentSlide]} 
            alt={`The Lumina Loft - Image ${currentSlide + 1}`}
            className="w-full h-full object-cover"
          />
          
          {/* Carousel Controls */}
          <button 
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
          
          {/* Carousel Indicators */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full ${currentSlide === index ? 'bg-blue-500' : 'bg-white bg-opacity-60'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Space Details Box */}
      <div className="border border-blue-300 rounded-lg mb-6">
        <div className="flex justify-between items-center p-4 border-b border-blue-200">
          <div>
            <h2 className="text-xl font-bold text-blue-900">The Lumina Loft</h2>
            <p className="text-sm text-gray-600">Downtown City Center, 3rd Floor</p>
          </div>
          <div className="flex flex-col items-end">
            <button className="bg-blue-500 text-white py-1 px-4 rounded-lg text-sm">Book now</button>
            <p className="text-blue-700 font-bold mt-1">$25/hr</p>
          </div>
        </div>

        <div className="p-4">
          <p className="text-gray-700">
            A bright and spacious study space perfect for individual or group study sessions. The Lumina Loft features modern amenities, comfortable seating, and a professional atmosphere that promotes focus and productivity.
          </p>
        </div>
      </div>

      {/* Amenities Section */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3">Amenities</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2">
          {amenities.map((amenity, index) => (
            <div key={index} className="flex items-center text-sm">
              <svg 
                className={`w-4 h-4 mr-2 ${amenity.available ? 'text-green-500' : 'text-gray-400'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
              <span className="text-gray-700">{amenity.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3">Reviews</h3>
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between mb-1">
                <p className="font-medium">{review.name}</p>
                <p className="text-xs text-gray-500">{review.date}</p>
              </div>
              <div className="flex mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i}
                    size={16}
                    className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpaceContent;