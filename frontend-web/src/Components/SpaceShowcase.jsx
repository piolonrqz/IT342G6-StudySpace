import React from 'react';
import { Link } from 'react-router-dom';

const spaceData = [
  { id: 1, imageUrl: '/space1.png', title: 'Produktiv', location: 'Fuente Osmeña', rating: '4.5 (128)' },
  { id: 2, imageUrl: '/space2.png', title: 'The Company CEBU', location: 'Cebu IT Park', rating: '4.7 (209)' },
  { id: 3, imageUrl: '/space3.png', title: 'WorkNook', location: 'Ayala Business Park', rating: '4.6 (157)' },
  // Add 6 more space objects here
  { id: 4, imageUrl: '/space1.png', title: 'Workplace Cafe', location: 'Location 4', rating: '4.0 (50)' },
  { id: 5, imageUrl: '/space2.png', title: 'WestPoint Working Space', location: 'Location 5', rating: '4.2 (75)' },
  { id: 6, imageUrl: '/space3.png', title: 'Mess Hall Cafe', location: 'Location 6', rating: '4.9 (210)' },
  { id: 7, imageUrl: '/space1.png', title: 'Mezzanine Cafe', location: 'Location 7', rating: '4.3 (90)' },
  { id: 8, imageUrl: '/space2.png', title: 'Bos Coffee', location: 'Location 8', rating: '4.6 (130)' },
  { id: 9, imageUrl: '/space3.png', title: 'Project Coffee', location: 'Location 9', rating: '4.1 (60)' },
];

export const SpaceShowcase = () => {
  return (
    <section className="px-12 py-8 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-poppins">Featured Spaces</h2>
        <Link to="/spaces" className="text-blue-600 hover:text-blue-800 font-poppins">See all</Link>
      </div>

      <div className="grid grid-cols-3 gap-10 px-4">
        {spaceData.map(space => (
          <div key={space.id} className="rounded-lg overflow-hidden shadow-md transform scale-95">
            <img src={space.imageUrl} alt={space.title} className="w-full h-max object-cover" />
            <div className="p-3">
              <h3 className="text-2xl font-semibold mb-1 font-poppins">{space.title}</h3>
              <p className="text-gray-500 text-lg font-poppins">{space.location} • {space.rating}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SpaceShowcase;