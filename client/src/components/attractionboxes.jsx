import React from 'react';

const AttractionBoxes = ({ attractions = [], onAddToRoute }) => {
  // Generate stars for the rating
  const renderStars = (rating) => {
    return (
      <div style={styles.starsContainer}>
        {[...Array(5)].map((_, i) => (
          <span key={i} style={{
            color: i < Math.floor(rating) ? '#FFCA28' : '#E0E0E0'
          }}>★</span>
        ))}
      </div>
    );
  };

  return (
    <div style={styles.section}>
      <div style={styles.sectionTitle}>Nearby Attractions</div>
      <div style={styles.scrollableContainer}>
        {attractions.length > 0 ? (
          attractions.map((attraction, index) => (
            <div key={attraction.id || index} style={styles.attractionCard}>
              <div style={styles.imageContainer}>
                <img 
                  src="/api/placeholder/400/320"
                  alt={attraction.name}
                  style={styles.attractionImage}
                />
                <span style={styles.duration}>+30min</span>
              </div>
              
              <div style={styles.contentContainer}>
                <div style={styles.nameRow}>
                  <span style={styles.attractionName}>{attraction.name}</span>
                </div>
                
                <div style={styles.ratingRow}>
                  <span style={styles.ratingValue}>4.5</span>
                  {renderStars(4.5)}
                  <span style={styles.reviewCount}>(10)</span>
                </div>
                
                <div style={styles.infoRow}>
                  <span style={styles.openHours}>Open 24 hours</span>
                </div>
                
                <div style={styles.tagsContainer}>
                  <span style={styles.tag}>{attraction.category || 'Attraction'}</span>
                  {attraction.distance && 
                    <span style={styles.tag}>{(attraction.distance/1000).toFixed(1)} km away</span>
                  }
                </div>
                
                <p style={styles.description}>
                  {attraction.description || 'A beautiful attraction to explore during your trip.'}
                </p>
                
                <div style={styles.actionButtons}>
                  <button style={styles.bookmarkButton}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button 
                    style={styles.addButton}
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
          ))
        ) : (
          <p style={{padding: '15px', color: '#666666'}}>No attractions found near the starting point.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  section: {
    width: '350px',
    margin: '0',
    padding: '0',
    height: '70vh',
    background: 'transparent',
    position: 'relative',
    borderTop: '1px solid #EEEEEE'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333333',
    margin: '0',
    padding: '15px',
    borderBottom: '1px solid #EEEEEE'
  },
  scrollableContainer: {
    height: 'calc(70vh - 50px)',
    overflowY: 'auto',
    padding: '0'
  },
  attractionCard: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'transparent',
    borderRadius: '0',
    borderBottom: '1px solid #EEEEEE',
    overflow: 'hidden',
    padding: '15px'
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '140px',
    borderRadius: '0',
    overflow: 'hidden'
  },
  attractionImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  duration: {
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    padding: '3px 6px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    fontSize: '11px',
    fontWeight: 'bold',
    borderRadius: '4px'
  },
  contentContainer: {
    padding: '12px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  nameRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  attractionName: {
    fontWeight: 'bold',
    fontSize: '16px',
    color: '#333333'
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center'
  },
  ratingValue: {
    fontWeight: 'bold',
    marginRight: '4px',
    fontSize: '13px',
    color: '#333333'
  },
  starsContainer: {
    display: 'flex',
    fontSize: '13px'
  },
  reviewCount: {
    color: '#666666',
    fontSize: '12px',
    marginLeft: '4px'
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  openHours: {
    color: '#4CAF50',
    fontSize: '12px',
    fontWeight: '500'
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px'
  },
  tag: {
    backgroundColor: '#F5F5F5',
    color: '#666666',
    fontSize: '11px',
    padding: '3px 6px',
    borderRadius: '4px'
  },
  description: {
    color: '#666666',
    fontSize: '12px',
    margin: '6px 0 0 0',
    lineHeight: 1.4,
    maxHeight: '48px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical'
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '8px'
  },
  bookmarkButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '5px 8px',
    paddingLeft: '0',
    color: '#666666',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  addButton: {
    background: 'transparent',
    border: '1px solid #4CAF50',
    cursor: 'pointer',
    padding: '6px 12px',
    color: '#4CAF50',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default AttractionBoxes;