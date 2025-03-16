import React, { useState } from 'react';
import axios from 'axios';
import images from './images';

function FetchPois() {
  const [pois, setPois] = useState([]);
  const [message, setMessage] = useState('');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [names, setNames] = useState([]);

  const fetchAPI = async () => {
    // const image_htmls = images.map(({id, src}) =>  <img key={id} src={src}/>)
    // console.log(images)

    if (!lat || !lon) {
      setMessage("Latitude and longitude are required");
      return;
    }
    try {
      const response = await axios.get(`http://localhost:3000/fetch-pois?lat=${lat}&lon=${lon}`);
      const data = response.data;

      if (data.success) {
        setPois(data.pois);
        setNames(data.pois.map(poi => {return poi.properties.name}));
        console.log(names)
        // console.log(JSON.stringify(pois,null,2))
        setMessage(`${data.pois.length} POIs fetched successfully!`);
      } else {
        setMessage("Error fetching POIs.");
      }
    } catch (error) {
      console.log(error)
      setMessage("Failed to fetch POIs.");
    }
  };

  return (
    <>
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
        <ul>
          {images.map((item, index) => (
            <li key={index}>
              <img src={item.src}/>
              <p>{item.src}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
    
  );
}

export default FetchPois;