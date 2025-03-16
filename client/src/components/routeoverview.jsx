import React, { useState } from 'react';
import FetchPois from "./fetchPois";
import Itinerary from "./itinerary";
import axios from 'axios';

const RouteOverview = () => {
  const [generatedText, setGeneratedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [poisData, setPoisData] = useState([]);
  const [selectedPois, setSelectedPois] = useState([]);

  // On POIs Fetch
  const onPoisFetch = (pois) => {
    setPoisData(pois);
    generateItinerary(pois);
  };

  const onAddToRoute = (poi) => {
    setSelectedPois(prev => {
      // Check if POI already exists in the selected list
      if (!prev.some(item => item.id === poi.id)) {
        return [...prev, poi];
      }
      return prev;
    });
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
      <Itinerary generatedText={generatedText} isLoading={isLoading} />
    </>
  );
};

export default RouteOverview;
