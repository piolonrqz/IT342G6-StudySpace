import React from "react";

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

  export default WhyChooseUsSection;