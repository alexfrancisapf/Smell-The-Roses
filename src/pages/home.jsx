import { Link } from "react-router-dom"
import { useRef, useEffect, useState } from "react";
import { TextField, Select, MenuItem, Checkbox, FormControlLabel, FormGroup, Button } from "@mui/material";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';

const Home = () => {
  const mapRef = useRef();
  const mapContainerRef = useRef();

  const [timeLimit, setTimeLimit] = useState("2 hours");
  const [preferences, setPreferences] = useState({
    beach: false,
    mountain: false,
    cultural: false,
    history: false,
    viewpoints: false,
  });
  const [eaten, setEaten] = useState(false);

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZXRoYW4yODUiLCJhIjoiY204OXRzcGpiMGMyODJxcHVyMjNrZHc5ayJ9.pvhW0YR7n7OX_MWbGT2l5A';
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
    });

    return () => {
      mapRef.current.remove();
    };
  }, []);

  const handlePreferenceChange = (event) => {
    setPreferences({ ...preferences, [event.target.name]: event.target.checked });
  };

  return (
    <div style={styles.wrapper}>
      {/* Left Side (Form Section) */}
      <div style={styles.content}>
        <h1 style={{ fontSize: "3rem" }}>Where are you going?</h1>

        {/* Address Input Fields */}
        <div style={styles.inputContainer}>
          <TextField label="Starting Point" variant="outlined" fullWidth />
          <p style={{ margin: "0 10px" }}>→</p>
          <TextField label="Destination" variant="outlined" fullWidth />
        </div>

        {/* Time Limit Dropdown */}
        <div style={{ marginTop: "20px" }}>
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
        <div style={{ marginTop: "20px" }}>
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
        <div style={{ marginTop: "20px" }}>
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
        <Link to="/trip">trip</Link>
        <Link to="/user">user</Link>

        {/* Submit Button */}
        <Button variant="contained" color="error" fullWidth style={styles.button}>
          Let's go! 🚗
        </Button>
      </div>

      {/* Right Side (Map Section) */}
      <div ref={mapContainerRef} style={styles.map} />
    </div>
  );
};

// Styles
const styles = {
  wrapper: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
  },
  content: {
    width: "50%",
    padding: "40px",
    display: "flex",
    flexDirection: "column",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  label: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    display: "block",
    marginBottom: "8px",
  },
  button: {
    marginTop: "20px",
    fontSize: "1.2rem",
    width: "200px",
    backgroundColor: "#FF4013",
  },
  map: {
    width: "50%",
    height: "100%",
  },
};

export default Home;
