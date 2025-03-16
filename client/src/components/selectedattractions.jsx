import React from 'react';

const SelectedAttractions = ({ attractions = [], onRemove }) => {
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Overview</h2>
      <div className="flex flex-col gap-2">
        {attractions.map((attraction, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-4 bg-gray-100 rounded-lg"
          >
            <span className="text-base font-medium">{attraction.name}</span>
            {attraction.removable && (
              <button
                onClick={() => onRemove(attraction)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
      {/* Removed the plus and minus buttons section */}
    </div>
  );
};

// Usage example
const App = () => {
  const [selectedAttractions, setSelectedAttractions] = React.useState([
    { name: "Sydney", removable: false },
    { name: "Katoomba Cafe", removable: true },
    { name: "Three Sisters", removable: true },
    { name: "Blue Mountains", removable: false }
  ]);

  const handleRemove = (attractionToRemove) => {
    setSelectedAttractions(selectedAttractions.filter(
      attraction => attraction.name !== attractionToRemove.name
    ));
  };

  return (
    <div className="p-4">
      <SelectedAttractions 
        attractions={selectedAttractions} 
        onRemove={handleRemove} 
      />
    </div>
  );
};

export default App;
