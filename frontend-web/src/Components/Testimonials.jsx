import React from 'react';

function Testimonials() {
  const testimonials = [
    {
      id: 1,
      text: "StudySpace helped me find the perfect spot to study. Highly recommended!",
      author: "Daniell Savvy Jones"
    },
    {
      id: 2,
      text: "StudySpace helped me find the perfect quiet space.",
      author: "Maria Helena Santiago"
    },
    {
      id: 3,
      text: "StudySpace helped me find the perfect spot to study. Highly recommended!",
      author: "Nathan Halliganns"
    }
  ];

  return (
    <section className="py-16 bg-gray-100" id="testimonials">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(testimonial => (
            <div 
              key={testimonial.id} 
              className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-purple-600 text-2xl mb-4">★★★★★</div>
              <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
              <span className="text-gray-800 font-semibold">
                {testimonial.author}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;