import React, { useState } from 'react';
import axios from 'axios';

function FetchPois() {
  const [pois, setPois] = useState([]);
  const [message, setMessage] = useState('');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');

  const fetchAPI = async () => {
    if (!lat || !lon) {
      setMessage("Latitude and longitude are required");
      return;
    }
    try {
      const response = await axios.get(`http://localhost:3000/fetch-pois?lat=${lat}&lon=${lon}`);
      const data = response.data;

      if (data.success) {
        setPois(data.pois);
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
      <h1>Map POIs</h1>
      <input type="text" placeholder="Latitude" value={lat} onChange={e => setLat(e.target.value)}/>
      <input type="text" placeholder="Longitude"value={lon} onChange={e => setLon(e.target.value)}/>
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
