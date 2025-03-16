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
  const [start, setStart] = useState("151.200439,-33.803759"); // Sydney Opera House coordinates
  const [end, setEnd] = useState("151.192504, -33.793361");
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

    mapRef.current.fitBounds(bounds, { padding: 50 });

    return () => {
      mapRef.current.remove();
    };
  }, [start, end, stops]);

  const getDirections = async () => {
    if (!start || !end) return alert("Please enter both start and end locations");
    
    const coordinates = [start, ...stops.split(";").filter(Boolean), end].join(";");
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.routes.length) {
        const route = data.routes[0].geometry;
        
        if (!mapRef.current.getSource("route")) {
          mapRef.current.addSource("route", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: route,
            },
          });

          mapRef.current.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: { "line-color": "#FF4013", "line-width": 5 },
          });
        } else {
          mapRef.current.getSource("route").setData({
            type: "Feature",
            properties: {},
            geometry: route,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.content}>
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

export default Trip;
