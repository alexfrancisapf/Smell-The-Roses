import React from 'react';

const Itinerary = ({ generatedText, isLoading }) => {
  return (
    <div>
      <h2>Itinerary</h2>
      {isLoading ? (
        <p>Generating itinerary...</p>
      ) : (
        <p style={{ whiteSpace: 'pre-wrap' }}>{generatedText}</p> // Display generated text
      )}
    </div>
  );
};

export default Itinerary;
