import React from 'react';

const AttractionBoxes = ({ pois, onAddToRoute }) => {
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

  // If no POIs are provided, show a loading message or empty state
  if (!pois || pois.length === 0) {
    return (
      <div style={styles.section}>
        <div style={styles.emptyState}>
          <p>No attractions available. Please fetch POIs first.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.section}>
      <div style={styles.scrollableContainer}>
        {pois.map(poi => (
          <div key={poi.id} style={styles.attractionCard}>
            <div style={styles.imageContainer}>
              <img 
                src={poi.image || "/api/placeholder/400/320"} 
                alt={poi.name}
                style={styles.attractionImage}
              />
              <span style={styles.duration}>+{poi.duration || 30}min</span>
            </div>
            
            <div style={styles.contentContainer}>
              <div style={styles.nameRow}>
                <span style={styles.attractionName}>{poi.name}</span>
              </div>
              
              <div style={styles.ratingRow}>
                <span style={styles.ratingValue}>{poi.rating || 0}</span>
                {renderStars(poi.rating || 0)}
                <span style={styles.reviewCount}>({poi.reviewCount || 0})</span>
              </div>
              
              <div style={styles.infoRow}>
                <span style={styles.openHours}>Open {poi.openHours || "24 hours"}</span>
              </div>
              
              <div style={styles.tagsContainer}>
                {(poi.tags || []).slice(0, 2).map((tag, index) => (
                  <span key={index} style={styles.tag}>{tag}</span>
                ))}
                {(poi.tags || []).length > 2 && (
                  <span style={styles.tag}>+{poi.tags.length - 2} more</span>
                )}
              </div>
              
              <p style={styles.description}>{poi.description || "No description available"}</p>
              
              <div style={styles.actionButtons}>
                <button style={styles.bookmarkButton}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button 
                  style={styles.addButton}
                  onClick={() => onAddToRoute && onAddToRoute(poi)}
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
        ))}
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
    position: 'absolute',
    left: 0,
    bottom: 0,
    borderTop: '1px solid #EEEEEE'
  },
  emptyState: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    padding: '20px',
    color: '#666666',
    fontSize: '14px',
    textAlign: 'center'
  },
  scrollableContainer: {
    height: 'calc(70vh - 50px)',
    overflowY: 'auto',
    padding: '0',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    '::-webkit-scrollbar': {
      display: 'none'
    }
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