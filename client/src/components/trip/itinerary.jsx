import React, { useState, useContext, useEffect } from "react";
import { TripContext } from "../../context/TripContext";
import './itinerary.css'

const Itinerary = ({ isLoading, generatedItinerary }) => {
    const { tripData, setTripData } = useContext(TripContext);
    const [startLocation, setStartLocation] = useState(tripData?.startLocation);
    
    useEffect(() => {
        setStartLocation(tripData?.startLocation);
    }, [tripData]);

    return (
        <div className="itinerary-container">
            <h2 className="itinerary-header">Starting Point 📌</h2>     
            <h2 className="">{startLocation}</h2>                   
            {isLoading ? (
            <p>Loading itinerary...</p>
            ) : generatedItinerary ? (
            <div className="itinerary">
                {generatedItinerary.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
                ))}
            </div>
            ) : (
                <p>No itinerary generated yet.</p>
            )}
        </div>
    );
};

export default Itinerary;