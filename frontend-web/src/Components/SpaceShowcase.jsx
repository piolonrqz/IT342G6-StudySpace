import React from 'react';

function SpaceShowcase() {
  const spaces = [
    {
      id: 1,
      image: '/path-to-grand-library.jpg',
      title: 'Historic Libraries',
      description: 'Classic study environments with timeless architecture'
    },
    {
      id: 2,
      image: '/path-to-modern-library.jpg',
      title: 'Modern Spaces',
      description: 'Contemporary spaces with all amenities'
    },
    {
      id: 3,
      image: '/path-to-cozy-cafe.jpg',
      title: 'Cozy Cafés',
      description: 'Comfortable environments with great coffee'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {spaces.map(space => (
            <div 
              key={space.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <img 
                src={space.image} 
                alt={space.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {space.title}
                </h3>
                <p className="text-gray-600">
                  {space.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SpaceShowcase;