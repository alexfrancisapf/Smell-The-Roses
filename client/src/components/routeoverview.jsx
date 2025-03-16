import React, { useState } from 'react';
import FetchPois from "./fetchPois";
import Itinerary from "./itinerary";
import axios from 'axios';

const RouteOverview = () => {
  const [generatedText, setGeneratedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // On POIs Fetch
  const onPoisFetch = (pois) => {
    generateItinerary(pois);
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
      <FetchPois onPoisFetch={onPoisFetch}/>
      <Itinerary generatedText={generatedText} isLoading={isLoading} />
    </>
  );
};

export default RouteOverview;
