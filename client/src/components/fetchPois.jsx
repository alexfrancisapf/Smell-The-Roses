import React, { useState } from 'react';
import axios from 'axios';

function FetchPois({ onPoisFetch }) {
  const [pois, setPois] = useState([]);
  const [message, setMessage] = useState('');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const defaultFilter = "Outdoors,Tourist Attraction,Park,Garden,River,Lake,Forest,Mountain,Island";
  const filterCategories = defaultFilter.split(',');

  // State for filters (set each  filter to false initially)
  const [filters, setFilters] = useState(
    filterCategories.reduce((acc, filter) => {
      acc[filter] = true;
      return acc;
    }, {})
  );

  // Handle checkbox change
  const handleFilterChange = (filter) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filter]: !prevFilters[filter],
    }));
  };

  // Fetch POIs
  const fetchAPI = async () => {
    if (!lat || !lon) {
      setMessage("Latitude and longitude are required");
      return;
    }
    const selectedFilters = Object.keys(filters).filter((filter) => filters[filter]);

    try {
      const response = await axios.get(`http://localhost:3000/fetch-pois`, {
        params: {
          lat,
          lon,
          filters: selectedFilters,
        }
      });
      const data = response.data;

      if (data.success) {
        setPois(data.pois)
        onPoisFetch(data.pois);
        setMessage(`${data.pois.length} POIs fetched successfully!`);
      } else {
        setMessage("Error fetching POIs.");
      }
    } catch (error) {
      setMessage("Failed to fetch POIs.");
    }
  };

  return (
    <div>
      <input type="text" placeholder="Latitude" value={lat} onChange={e => setLat(e.target.value)} />
      <input type="text" placeholder="Longitude" value={lon} onChange={e => setLon(e.target.value)} />
      
      {/* Filter Checkboxes */}
      <div>
        {filterCategories.map((filter, index) => (
          <label key={index}>
            <input 
              type="checkbox" 
              checked={filters[filter]} 
              onChange={() => handleFilterChange(filter)} 
            />
            {filter}
          </label>
        ))}
      </div>
      
      <button onClick={fetchAPI}>Fetch POIs</button>
      <p>{message}</p>
      
      <ul>
        {pois.map((poi, index) => (
          <li key={index}>{poi.properties.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default FetchPois;
