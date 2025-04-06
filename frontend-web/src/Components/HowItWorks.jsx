import React from 'react';

function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: 'Search',
      description: 'Find available spaces near you'
    },
    {
      id: 2,
      title: 'Book',
      description: 'Reserve your preferred time slot'
    },
    {
      id: 3,
      title: 'Study',
      description: 'Enjoy your productive space'
    }
  ];

  return (
    <section className="py-16 bg-gray-100" id="how-it-works">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map(step => (
            <div 
              key={step.id} 
              className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-600 text-white text-2xl font-bold mb-4">
                {step.id}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;