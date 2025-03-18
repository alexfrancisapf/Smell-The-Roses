import { Link, useNavigate } from "react-router-dom";
import { TripContext } from "../context/TripContext";
import { useRef, useEffect, useState, useContext } from "react";
import { TextField, Select, MenuItem, Checkbox, FormControlLabel, FormGroup, Button } from "@mui/material";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { AddressAutofill } from "@mapbox/search-js-react";

const Home = () => {
  const navigate = useNavigate();
  const { setTripData } = useContext(TripContext);

  const mapRef = useRef();
  const mapContainerRef = useRef();
  const [mapLoaded, setMapLoaded] = useState(false);

  const [timeLimit, setTimeLimit] = useState("2 hours");
  const [preferences, setPreferences] = useState({
    beach: false,
    mountain: false,
    cultural: false,
    history: false,
    viewpoints: false,
  });
  const [eaten, setEaten] = useState(false);

  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [startCoords, setStartCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);

  const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_API_KEY;

  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
      const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [151.2153, -33.8568],
      zoom: 9,
    });

    mapRef.current = map;
    map.on("load", () => setMapLoaded(true));

    return () => map.remove();

  }, []);

  useEffect(() => {
    if (!mapLoaded) return;
    const map = mapRef.current;
    
    map.getSource("route")?.setData({ type: "FeatureCollection", features: [] });

    if (startCoords) {
      new mapboxgl.Marker().setLngLat(startCoords).addTo(map);
      map.flyTo({ center: startCoords, zoom: 12 });
    }
    if (destinationCoords) {
      new mapboxgl.Marker().setLngLat(destinationCoords).addTo(map);
      map.flyTo({ center: destinationCoords, zoom: 12 });
    }

    if (startCoords && destinationCoords) {
      fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords[0]},${startCoords[1]};${destinationCoords[0]},${destinationCoords[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`)
        .then((res) => res.json())
        .then((data) => {
          const route = data.routes[0].geometry;
          if (map.getSource("route")) {
            map.getSource("route").setData({ type: "Feature", geometry: route });
          } else {
            map.addSource("route", { type: "geojson", data: { type: "Feature", geometry: route } });
            map.addLayer({
              id: "route",
              type: "line",
              source: "route",
              layout: { "line-join": "round", "line-cap": "round" },
              paint: { "line-color": "#FF4013", "line-width": 4 },
            });
          }
        });
    }
  }, [startCoords, destinationCoords, mapLoaded]);


  const handlePreferenceChange = (event) => {
    setPreferences({ ...preferences, [event.target.name]: event.target.checked });
  };

  const handleSubmit = () => {

    if (!startLocation.trim() || !destination.trim()) {
      alert("Please enter both a starting point and a destination.");
      return;
    }

    const routeCoords = [startCoords, destinationCoords];

    setTripData({
      startLocation,
      startCoords,
      destination,
      destinationCoords,
      timeLimit,
      preferences,
      eaten,
      routeCoords
    });

    navigate("/trip");
  };

  return (
    <div style={styles.wrapper}>
      {/* Left Side (Form Section) */}
      <div style={styles.content}>
        <h1 style={{ fontSize: "3rem" }}>Where are you going?</h1>

        {/* Address Input Fields with Mapbox Autofill */}
        <div style={styles.inputContainer}>
          <div style={{ width: "100%" }}>
            <label style={styles.label}>Starting Point</label>
            <AddressAutofill
              accessToken={MAPBOX_ACCESS_TOKEN}
              onRetrieve={(result) => {
                setStartCoords([result.features[0].geometry.coordinates[0], result.features[0].geometry.coordinates[1]]);
                setStartLocation(result.features[0].properties.full_address)
              }}
            >
              <TextField
                variant="outlined"
                fullWidth
                style={styles.address}
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
                InputProps={{ style: { height: 56 } }} 
              />
            </AddressAutofill>
          </div>
          
          <p style={{ margin: "0 10px" }}>→</p>
          
          <div style={{ width: "100%" }}>
            <label style={styles.label}>Destination</label>
            <AddressAutofill
              accessToken={MAPBOX_ACCESS_TOKEN}
              onRetrieve={(result) => {
                setDestinationCoords([result.features[0].geometry.coordinates[0], result.features[0].geometry.coordinates[1]]);
                setDestination(result.features[0].properties.full_address)
              }}
            >
             <TextField
              variant="outlined"
              fullWidth
              style={styles.address}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              InputProps={{ style: { height: 56 } }}
            />

            </AddressAutofill>
          </div>
        </div>

        {/* Time Limit Dropdown */}
        <div style={{ marginTop: "40px" }}>
          <label style={styles.label}>Time Limit</label>
          <Select value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} fullWidth>
            <MenuItem value="1 hour">1 hour</MenuItem>
            <MenuItem value="2 hours">2 hours</MenuItem>
            <MenuItem value="3 hours">3 hours</MenuItem>
            <MenuItem value="Half-day">Half-day</MenuItem>
            <MenuItem value="Full-day">Full-day</MenuItem>
          </Select>
        </div>

        {/* Preferences Checkboxes */}
        <div style={{ marginTop: "40px" }}>
          <label style={styles.label}>What do you want to see?</label>
          <FormGroup row>
            {Object.keys(preferences).map((key) => (
              <FormControlLabel
                key={key}
                control={<Checkbox checked={preferences[key]} onChange={handlePreferenceChange} name={key} />}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
              />
            ))}
          </FormGroup>
        </div>

        {/* Have You Eaten? */}
        <div style={{ marginTop: "40px" }}>
          <label style={styles.label}>Have you eaten yet?</label>
          <FormGroup row>
            <FormControlLabel
              control={<Checkbox checked={eaten} onChange={() => setEaten(!eaten)} />}
              label="Yes"
            />
            <FormControlLabel
              control={<Checkbox checked={!eaten} onChange={() => setEaten(!eaten)} />}
              label="No"
            />
          </FormGroup>
        </div>

        {/* Submit Button */}
        <Button variant="contained" fullWidth style={styles.button} onClick={handleSubmit}>
          Let's go! 🚗
        </Button>
      </div>

      {/* map */}
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
    width: "50%",
    padding: "80px 40px",
    display: "flex",
    flexDirection: "column",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "100%",
    marginTop: "20px"
  },
  label: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    display: "block",
    marginBottom: "8px",
  },
  address: {
    width: "100%"
  },
  button: {
    marginTop: "50px",
    fontSize: "1.2rem",
    width: "200px",
    backgroundColor: "#FF4013",
    boxShadow: "none", 
    elevation: 0,
    textTransform: "none",
    borderRadius: "8px",

  },
  map: {
    width: "50%",
    height: "100%",
  },
};

export default Home;