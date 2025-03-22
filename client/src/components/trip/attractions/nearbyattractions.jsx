import React from 'react';
import './nearbyattractions.css';
import { getImage } from "../../../utils/getImage";

const AttractionBoxes = ({ attractions = [] }) => {

  // Generate stars for the rating
  const renderStars = (rating) => {
    return (
      <div className="starsContainer">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < Math.floor(rating) ? 'filledStar' : 'emptyStar'}>★</span>
        ))}
      </div>
    );
  };

  return (
    <div className="section">
      <div className="scrollableContainer">
        {attractions.length > 0 ? (
          attractions.map((attraction, index) => {
            return (
              <div key={attraction.id || index} className="attractionCard">
                <div className="imageContainer">
                  <img 
                    src={getImage(attraction.category)}
                    alt={attraction.name}
                    className="attractionImage"
                  />
                  <span className="duration">+30min</span>
                </div>
                
                <div className="contentContainer">
                  <div className="nameRow">
                    <span className="attractionName">{attraction.name}</span>
                  </div>
                  
                  <div className="ratingRow">
                    <span className="ratingValue">4.5</span>
                    {renderStars(4.5)}
                    <span className="reviewCount">(10)</span>
                  </div>
                  
                  <div className="infoRow">
                    <span className="openHours">Open 24 hours</span>
                  </div>
                  
                  <div className="tagsContainer">
                    {attraction.category?.map((cat, index) => (
                      <span key={index} className="tag">
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </span>
                    )) || <span className="tag">Attraction</span>}
                  </div>
                  
                  <p className="description">
                    {attraction.description || 'A beautiful attraction to explore during your trip.'}
                  </p>
                  
                  <div className="actionButtons">
                    {attraction.distance && 
                      <span className="distance">{attraction.distance.toFixed(1)} km away</span>
                    }
                    <div className="left-items">
                      <button className="bookmarkButton">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button 
                        className="addButton"
                        onClick={() => onAddToRoute && onAddToRoute(attraction)}
                      >
                        Add to route
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginLeft: '4px'}}>
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                          <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p style={{padding: '15px', color: '#666666'}}>No attractions found near the starting point.</p>
        )}
      </div>
    </div>
  );
};

export default AttractionBoxes;
