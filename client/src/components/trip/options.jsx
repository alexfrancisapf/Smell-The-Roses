import React, { useState, useContext } from 'react';
import { Button, TextField, FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import { AddressAutofill } from "@mapbox/search-js-react";
import { TripContext } from "../../context/TripContext";
import Logo from "../Logo.jsx";
import './options.css';

function Options() {
    const { tripData, setTripData } = useContext(TripContext);

    const [startLocation, setStartLocation] = useState(tripData?.startLocation || "");
    const [endLocation, setEndLocation] = useState(tripData?.destination || "");
    const [duration, setDuration] = useState('');
    const [leaveOrDepart, setLeaveOrDepart] = useState('Leave Now');
    const [departAtTime, setDepartAtTime] = useState('');  // Track the time input for "Depart At"

    const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_API_KEY;

    // Values for trip duration
    const getDurationValues = () => {
        let options = [];
        for (let i = 15; i <= 1440; i += 15) {
            const hours = Math.floor(i / 60);
            const minutes = i % 60;
            const label = `${hours > 0 ? `${hours} Hour${hours > 1 ? 's' : ''}` : ''} ${minutes > 0 ? `${minutes} Minute${minutes > 1 ? 's' : ''}` : ''}`;
            options.push({ value: i, label });
        }
        return options;
    };

    const handleDurationChange = (event) => {
        setDuration(event.target.value);
    };

    const handleLeaveOrDepartChange = (event) => {
        setLeaveOrDepart(event.target.value);
    };

    const handleDepartAtTimeChange = (event) => {
        setDepartAtTime(event.target.value);
    };

    return (
        <div className="options-container">
            <Logo />
    
            {/* Start and destination */}
            <AddressAutofill
                accessToken={MAPBOX_ACCESS_TOKEN}
                onRetrieve={(result) => {
                    const startCoords = [result.features[0].geometry.coordinates[0], result.features[0].geometry.coordinates[1]];
                    const startLocation = result.features[0].properties.full_address;
                    setStartLocation(startLocation);
                    setTripData((prevData) => ({
                        ...prevData,
                        startLocation: startLocation,
                        startCoords: startCoords,
                        routeCoords: [startCoords, ...(prevData.routeCoords?.slice(1) || [])] // Replace start coordinate
                    }));
                }}
            >
                <TextField
                    fullWidth
                    label="Start"
                    value={startLocation}
                    onChange={(e) => { setStartLocation(e.target.value); }}
                    InputProps={{ style: { height: 56 } }} 
                />
            </AddressAutofill>

            <AddressAutofill
                accessToken={MAPBOX_ACCESS_TOKEN}
                onRetrieve={(result) => {
                    const endCoords = [result.features[0].geometry.coordinates[0], result.features[0].geometry.coordinates[1]];
                    const endLocation = result.features[0].properties.full_address;
                    setEndLocation(endLocation);
                    setTripData((prevData) => ({
                        ...prevData,
                        destination: endLocation,
                        destinationCoords: endCoords,
                        routeCoords: [...(prevData.routeCoords?.slice(0, -1) || []), endCoords] // Replace destination coordinate
                    }));
                }}
            >
                <TextField
                    fullWidth
                    label="Destination"
                    value={endLocation}
                    onChange={(e) => { setEndLocation(e.target.value); }}
                    InputProps={{ style: { height: 56 } }} 
                />
            </AddressAutofill>

            {/* Duration */}
            <FormControl fullWidth>
                <InputLabel>Duration</InputLabel>
                <Select 
                    label="Duration" 
                    value={duration} 
                    onChange={handleDurationChange}
                    MenuProps={{
                        PaperProps: {
                            style: {
                                maxHeight: 200,
                                overflowY: 'auto',
                            }
                        }}
                    }
                >
                    {getDurationValues().map((option) => (
                        <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                    ))}
                </Select>
            </FormControl>

                        {/* Leave and depart */}
            <div className="leave-container">
                <div className="leave-form">
                    <FormControl fullWidth variant="standard">
                        <Select 
                            value={leaveOrDepart} 
                            onChange={handleLeaveOrDepartChange}
                            disableUnderline
                            sx={{ width: "300" }}
                        >
                            <MenuItem value="Leave Now">Leave Now</MenuItem>
                            <MenuItem value="Depart At">Depart At</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                {/* Conditionally render the TextField if 'Depart At' is selected */}
                {leaveOrDepart === 'Depart At' && (
                    <TextField
                        className="depart-time"
                        type="time"
                        value={departAtTime}
                        onChange={handleDepartAtTimeChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
                    />
                )}
            </div>

            {/* Filter and sort */ }
            <div className="filter-container">
                <Button variant="contained" sx={{ backgroundColor: "#FF4013", width: "50%" }}>Filters</Button>
                <Button variant="contained" sx={{ backgroundColor: "#FF4013", width: "50%" }}>Generate</Button>
            </div>
        </div>
    );
}

export default Options;
