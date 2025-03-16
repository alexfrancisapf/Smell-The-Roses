import { Link } from "react-router-dom"
import { useRef, useEffect, useState, useCallback } from "react";
import { TextField, Select, MenuItem, Checkbox, FormControlLabel, FormGroup, Button } from "@mui/material";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import RouteOverview from "../components/routeoverview"
// import AttractionList from "../components/AttractionList";
import AttractionBoxes from "../components/attractionboxes";

const Home = () => {
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

  // Get directions function (memoized to avoid recreating on every render)
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
        fetchPOIs(coords);
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
  }, [coordinates, getDirections, mapInitialized]);

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
        <button variant="contained" style={styles.button}>Save Trip</button>
        <AttractionBoxes />
      </div>
      <div style={styles.content}>
        <RouteOverview />
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
};

export default Home;