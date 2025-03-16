import { Link } from "react-router-dom"
import { useRef, useEffect, useState, useCallback } from "react";
import { TextField, Button } from "@mui/material";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import AttractionBoxes from "../components/attractionboxes";
import axios from 'axios';
import SelectedAttractions from "../components/selectedattractions";

const Trip = () => {
  const mapRef = useRef();
  const mapContainerRef = useRef();
  const [coordinates, setCoordinates] = useState([
    [151.200439, -33.803759], // Sydney Opera House coordinates
    [151.192504, -33.793361]  // End point
  ]);
  
  // For the text input field
  const [coordinatesText, setCoordinatesText] = useState(
    "151.200439,-33.803759; 151.192504,-33.793361"
  );

  // Map initialization flag
  const [mapInitialized, setMapInitialized] = useState(false);
  
  // State for attractions and itinerary
  const [attractions, setAttractions] = useState([]);
  const [selectedAttractions, setSelectedAttractions] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [generatedItinerary, setGeneratedItinerary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAddToRoute = (attraction) => {
    setSelectedAttractions(prev => {
      if (!prev.some(item => item.id === attraction.id)) {
        return [...prev, attraction];
      }
      return prev;
// import { Link } from "react-router-dom"
import { useRef, useEffect, useState } from "react";
import { TextField, Select, MenuItem, Checkbox, FormControlLabel, FormGroup, Button } from "@mui/material";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import RouteOverview from "../components/routeoverview"
import React, { useContext } from "react"
import { TripContext } from "../context/TripContext"
import FetchPois from "../components/fetchPois"

const Trip = () => {

  const { tripData, setTripData } = useContext(TripContext);

  const mapRef = useRef();
  const mapContainerRef = useRef();
  const [start, setStart] = useState(tripData?.startCoords); // Sydney Opera House coordinates
  const [end, setEnd] = useState(tripData?.destinationCoords);
  const [stops, setStops] = useState([]); // Additional stops

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZXRoYW4yODUiLCJhIjoiY204OXRzcGpiMGMyODJxcHVyMjNrZHc5ayJ9.pvhW0YR7n7OX_MWbGT2l5A';
    // const [startLng, startLat] = start.split(",").map(Number);
    const coordinates = [
      start.split(",").map(Number),
      ...stops, // stops is now already an array
      end.split(",").map(Number)
    ];
    
    const bounds = new mapboxgl.LngLatBounds();
    coordinates.forEach(coord => bounds.extend(coord));
    
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
    });
  };

  // Convert POI data to attraction format
  const convertPoisToAttractions = (pois) => {
    return pois.map(poi => ({
      id: poi.id || `poi-${Math.random().toString(36).substr(2, 9)}`,
      name: poi.name || poi.title || "Unnamed Attraction",
      category: poi.kinds ? poi.kinds.split(',')[0] : "Attraction",
      distance: poi.dist || 0,
      lat: poi.point?.lat || poi.lat,
      lon: poi.point?.lon || poi.lon,
      description: poi.description || ""
    }));
  };

  // Fetch POIs from starting point and generate itinerary
  const fetchPOIsAndGenerateItinerary = useCallback(async () => {
    if (coordinates.length === 0) return;
    
    const startPoint = coordinates[0];
    const defaultFilters = ["Outdoors", "Tourist Attraction", "Park", "Garden", "River", "Lake", "Forest", "Mountain", "Island"];
    
    try {
      setStatusMessage("Fetching POIs from starting point...");
      setIsLoading(true);
      
      const response = await axios.get(`http://localhost:3000/fetch-pois`, {
        params: {
          lat: startPoint[1],
          lon: startPoint[0],
          filters: defaultFilters,
        }
      });
      
      const data = response.data;
      if (data.success) {
        // Convert POIs to attraction format
        const formattedAttractions = convertPoisToAttractions(data.pois);
        setAttractions(formattedAttractions);
        setStatusMessage(`${formattedAttractions.length} attractions found. Generating itinerary...`);
        
        // Generate itinerary with the fetched POIs
        const itineraryResponse = await axios.post(`http://localhost:3000/generate-itinerary`, {
          destination: "Blue Mountains",
          pois: data.pois
        });
        
        const itineraryData = itineraryResponse.data;
        if (itineraryData.success) {
          setGeneratedItinerary(itineraryData.itinerary);
          setStatusMessage("Itinerary generated successfully!");
        } else {
          setStatusMessage("Error generating itinerary.");
        }
      } else {
        setStatusMessage("Error fetching POIs.");
      }
    } catch (error) {
      setStatusMessage(`Error: ${error.message}`);
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [coordinates]);

  // Parse coordinates from text
  const parseCoordinates = (text) => {
    try {
      const parsedCoords = text
        .split(';')
        .map(coordPair => coordPair.trim())
        .filter(coordPair => coordPair.length > 0)
        .map(coordPair => {
          const [lng, lat] = coordPair.split(',').map(coord => parseFloat(coord.trim()));
          if (isNaN(lng) || isNaN(lat)) {
            throw new Error("Invalid coordinate format");
          }
          return [lng, lat];
        });
      
      if (parsedCoords.length < 2) {
        throw new Error("At least two coordinates (start and end) are required");
      }
      
      return parsedCoords;
    } catch (error) {
      console.error(`Error parsing coordinates: ${error.message}`);
      return null;
    }
  };

  // Get directions function
  const getDirections = useCallback(async (coords) => {
    if (!coords || coords.length < 2 || !mapRef.current || !mapInitialized) return;
    
    const coordString = coords
      .map(coord => coord.join(','))
      .join(';');
    
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordString}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.routes && data.routes.length) {
        const route = data.routes[0].geometry;
        
        if (mapRef.current.getSource("route")) {
          mapRef.current.getSource("route").setData({
            type: "Feature",
            properties: {},
            geometry: route,
          });
        }
      } else {
        console.error("No route found between the specified coordinates");
      }
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  }, [mapInitialized]);

  // Effect to initialize map
  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZXRoYW4yODUiLCJhIjoiY204OXRzcGpiMGMyODJxcHVyMjNrZHc5ayJ9.pvhW0YR7n7OX_MWbGT2l5A';
    
    const bounds = new mapboxgl.LngLatBounds();
    coordinates.forEach(coord => bounds.extend(coord));
    
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
    });

    mapRef.current.fitBounds(bounds, { padding: 50 });
    
    mapRef.current.on('load', () => {
      // Add source and layer for the route
      mapRef.current.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: []
          }
        }
      });

      mapRef.current.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#FF4013", "line-width": 5 },
      });

      setMapInitialized(true);
      getDirections(coordinates);
      // Fetch POIs and generate itinerary when map is initialized
      fetchPOIsAndGenerateItinerary();
    });

    return () => {
      mapRef.current.remove();
    };
  }, []); // Only run once on component mount

  // Effect to update markers and get directions when coordinates change
  useEffect(() => {
    if (!mapRef.current || !mapInitialized) return;
    
    // Clear existing markers
    const markers = document.getElementsByClassName('mapboxgl-marker');
    while(markers[0]) {
      markers[0].remove();
    }
    
    // Add new markers
    coordinates.forEach((coord, index) => {
      const marker = new mapboxgl.Marker({
        color: index === 0 ? '#00FF00' : (index === coordinates.length - 1 ? '#FF0000' : '#0000FF')
      })
        .setLngLat(coord)
        .addTo(mapRef.current);
    });

    // Fit bounds to include all coordinates
    const bounds = new mapboxgl.LngLatBounds();
    coordinates.forEach(coord => bounds.extend(coord));
    mapRef.current.fitBounds(bounds, { padding: 50 });
    
    // Update directions with new coordinates
    getDirections(coordinates);
    
    // Fetch POIs and generate itinerary when coordinates change
    fetchPOIsAndGenerateItinerary();
  }, [coordinates, getDirections, mapInitialized, fetchPOIsAndGenerateItinerary]);

  // Debounced input handler - update directions after typing stops
  const [inputTimeout, setInputTimeout] = useState(null);
  
  const handleCoordinatesChange = (e) => {
    const newText = e.target.value;
    setCoordinatesText(newText);
    
    // Clear any existing timeout
    if (inputTimeout) {
      clearTimeout(inputTimeout);
    }
    
    // Set a new timeout
    const timeoutId = setTimeout(() => {
      const newCoords = parseCoordinates(newText);
      if (newCoords) {
        setCoordinates(newCoords);
      }
    }, 500); // 500ms debounce delay
    
    setInputTimeout(timeoutId);
  };

  // Add attractions to the map
  useEffect(() => {
    if (!mapRef.current || !mapInitialized || attractions.length === 0) return;

    // Remove previous attraction markers (if any)
    const attractionMarkers = document.querySelectorAll('.attraction-marker');
    attractionMarkers.forEach(marker => marker.remove());

    // Add attraction markers to the map
    attractions.forEach(attraction => {
      if (attraction.lat && attraction.lon) {
        const markerElement = document.createElement('div');
        markerElement.className = 'attraction-marker';
        markerElement.style.width = '15px';
        markerElement.style.height = '15px';
        markerElement.style.borderRadius = '50%';
        markerElement.style.backgroundColor = '#2196F3';
        markerElement.style.border = '2px solid white';
        
        new mapboxgl.Marker(markerElement)
          .setLngLat([attraction.lon, attraction.lat])
          .setPopup(new mapboxgl.Popup().setHTML(`<strong>${attraction.name}</strong><br>${attraction.category}`))
          .addTo(mapRef.current);
      }
    });
  }, [attractions, mapInitialized]);

  return (
    <div style={styles.wrapper}>
      <div style={styles.content}>
        <TextField 
          label="Coordinates (lng,lat; lng,lat; ...)" 
          value={coordinatesText} 
          onChange={handleCoordinatesChange}
          multiline
          rows={4}
          fullWidth 
          helperText="Enter coordinates as longitude,latitude pairs separated by semicolons. First is start, last is end, others are stops."
        />
        <Button variant="contained" style={styles.button}>Save Trip</Button>
        {statusMessage && <p>{statusMessage}</p>}
        <AttractionBoxes attractions={attractions} onAddToRoute={handleAddToRoute} />
        <h1 style={{ fontSize: "3rem" }}>Why am I here?</h1>
        <TextField label="Start (lng,lat)" value={start} onChange={(e) => setStart(e.target.value)} fullWidth />
        <TextField label="Stops (lng,lat;lng,lat)" value={stops} onChange={(e) => setStops(e.target.value)} fullWidth style={{ marginTop: 10 }} />
        <TextField label="End (lng,lat)" value={end} onChange={(e) => setEnd(e.target.value)} fullWidth style={{ marginTop: 10 }} />
        <Button variant="contained" style={styles.button} onClick={getDirections}>Get Directions</Button>
        <button variant="contained" style={styles.button}>Save Trip</button>
        <p>Trip Data: {tripData ? JSON.stringify(tripData) : "No trip selected"}</p>
        <button onClick={() => setTripData({ destination: "Japan", timeLimit: "2 hours" })}>
          Set Trip Data
        </button>
      </div>
  
      <div style={styles.content}>
        <h2>Selected Attractions</h2>
        <SelectedAttractions 
          attractions={selectedAttractions} 
          onRemove={(attraction) => {
            setSelectedAttractions(prev => prev.filter(a => a.id !== attraction.id));
          }}
        />
  
        <h2>Generated Itinerary</h2>
        {isLoading ? (
          <p>Loading itinerary...</p>
        ) : generatedItinerary ? (
          <div style={styles.itinerary}>
            {generatedItinerary.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        ) : (
          <p>No itinerary generated yet.</p>
        )}
      </div>
  
      <div ref={mapContainerRef} style={styles.map} />
    </div>
    
  );
};

const styles = {
  wrapper: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
  },
  content: {
    width: "33%",
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
  },
  button: {
    marginTop: "20px",
    fontSize: "1.2rem",
    width: "200px",
    backgroundColor: "#FF4013",
  },
  map: {
    width: "33%",
    height: "100%",
  },
  itinerary: {
    backgroundColor: "#f5f5f5",
    padding: "15px",
    borderRadius: "5px",
    marginTop: "10px",
  }
};

export default Trip;

