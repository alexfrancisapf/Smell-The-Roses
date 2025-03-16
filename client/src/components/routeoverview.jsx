import React, { useState } from 'react';
import FetchPois from "./fetchPois";
import Itinerary from "./itinerary";
import axios from 'axios';

const RouteOverview = ({ onPoisUpdate, selectedPois = [] }) => {
  const [generatedText, setGeneratedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [poisData, setPoisData] = useState([]);

  // On POIs Fetch
  const onPoisFetch = (pois) => {
    setPoisData(pois);
    generateItinerary(pois);
    
    // Pass data to parent component
    if (onPoisUpdate) {
      onPoisUpdate(pois);
    }
  };

  // Generates an Itinerary
  const generateItinerary = async (pois) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`http://localhost:3000/generate-itinerary`, {
        destination: "Blue Mountains",
        pois: pois
      });
      const data = response.data;
  
      if (data.success) {
        setGeneratedText(data.itinerary);
      } else {
        setGeneratedText("Error generating itinerary");
      }
    } catch (error) {
      setGeneratedText("Error generating itinerary: " + error.message); 
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <h1>Filters</h1>
      <FetchPois onPoisFetch={onPoisFetch} />
      <div>
        <h2>Selected Attractions</h2>
        <ul>
          {selectedPois.map((poi, index) => (
            <li key={index}>{poi.name}</li>
          ))}
        </ul>
      </div>
      <Itinerary generatedText={generatedText} isLoading={isLoading} />
    </>
  );
};

export default RouteOverview;