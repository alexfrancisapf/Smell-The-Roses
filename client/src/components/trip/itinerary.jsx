import React, { useState, useContext, useEffect } from "react";
import { TripContext } from "../../context/TripContext";
import './itinerary.css';

const Itinerary = ({ isLoading, generatedItinerary }) => {
    const { tripData } = useContext(TripContext);
    const [startLocation] = useState(tripData?.startLocation.split(',')[0]);
    const [destination] = useState(tripData?.destination.split(',')[0]);
    const [duration, setDuration] = useState(tripData?.duration);
    const [distance, setDistance] = useState(tripData?.distance);

    useEffect(() => {
        setDuration(tripData?.duration);
        setDistance(tripData?.distance);
    }, [tripData?.duration, tripData?.distance]);

    // Convert seconds to string format (hours minutes)
    const convertSeconds = (seconds) => {
        const hours = Math.floor(seconds / 3600); 
        const mins = Math.floor((seconds % 3600) / 60);
        return `${hours} hr ${mins} mins`;
    };

    // Render itinerary with category-based images
    const renderItinerary = (itinerary) => {
        return itinerary.split("\n").map((line, i) => {
            const match = line.match(/([A-Za-z ]+): ([^[\n]+)/); // Regex to match [Category]: [POI Name]
    
            // Return POI image
            if (!match && line.includes("/src")) {
                return (
                    <div key={i} className="itinerary-image-container">
                        <img 
                            src={line}
                            alt="Image of the POI"
                            className="itinerary-image"
                        />
                        <span className="duration">9:30 am</span>
                    </div>
                )
            } 
            // Return POI description
            else if (!match) {
                return <p key={i}>{line}</p>; 
            }
            const category = match[1];  
            const poiName = match[2];
    
            // Return POI Title
            return (
                <div key={i} className="itinerary-item">  {/* Add key here */}
                    <p className="itinerary-category">{category}: {poiName}</p>
                </div>       
            );
        });
    };
    // Check itinerary generation status
    if (isLoading) {
        return <div className="itinerary-container"><p>Loading itinerary...</p></div>;
    }
    if (!generatedItinerary) {
        return <div className="itinerary-container"><p>Failed to generate itinerary</p></div>;
    }
    const errorMessage = "We couldn't find any points of interest to create your itinerary. Please adjust your filters.";
    if (generatedItinerary.includes(errorMessage)) {
        return <div className="itinerary-container"><p>{errorMessage}</p></div>;
    }
    return (
        <div className="itinerary-container">
            <div className="itinerary-header">
                <h2 className="itinerary-header-text">Starting Point 📌</h2>     
                <h1 className="itinerary-header-location">{startLocation}</h1>    
            </div>               

            <div className="itinerary-details">
                <p className="itinerary-details-duration"><strong>Total Duration: </strong>{convertSeconds(duration)}</p>
                <p className="itinerary-details-distance"><strong>Total Distance: </strong>{Math.round(distance / 1000)} km</p>
                <p className="itinerary-details-eta"><strong>Estimated Time of Arrival: </strong>9:34 am</p>
            </div>
            <div className="itinerary">
                {renderItinerary(generatedItinerary)}
            </div>
            <div className="itinerary-header">
                <h2 className="itinerary-header-text">Destination 📌</h2>     
                <h1 className="itinerary-header-location">{destination}</h1>    
            </div>       
        </div>
    );
};

export default Itinerary;
