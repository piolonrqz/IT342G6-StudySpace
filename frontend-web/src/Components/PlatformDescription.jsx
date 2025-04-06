import React from "react";

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
  