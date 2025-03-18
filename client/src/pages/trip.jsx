import { useRef, useEffect, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import AttractionBoxes from "../components/trip/attractions/nearbyattractions";
import axios from "axios";
import SelectedAttractions from "../components/trip/attractions/selectedattractions";
import React, { useContext } from "react";
import { TripContext } from "../context/TripContext";
import "./trip.css";
import Options from "../components/trip/options";
import Overview from "../components/trip/overview";
import Itinerary from "../components/trip/itinerary";

const Trip = () => {
  const { tripData, setTripData } = useContext(TripContext);
  const mapRef = useRef();
  const mapContainerRef = useRef();

  // Map initialization flag
  const [mapInitialized, setMapInitialized] = useState(false);

  // State for attractions and itinerary
  const [attractions, setAttractions] = useState([]);
  const [selectedAttractions, setSelectedAttractions] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [generatedItinerary, setGeneratedItinerary] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_API_KEY;

  const handleAddToRoute = (attraction) => {
    setSelectedAttractions((prev) => {
      if (!prev.some((item) => item.id === attraction.id)) {
        return [...prev, attraction];
      }
      return prev;
    });
  };

  // Get distance betwen two coordinates
  const haversine = (coords1, coords2) => {
    const [lat1, lon1] = coords1;
    const [lat2, lon2] = coords2;

    const toRadians = (deg) => deg * (Math.PI / 180);
    const radLat1 = toRadians(lat1);
    const radLon1 = toRadians(lon1);
    const radLat2 = toRadians(lat2);
    const radLon2 = toRadians(lon2);

    // Haversine formula
    const dlat = radLat2 - radLat1;
    const dlon = radLon2 - radLon1;
    const a =
      Math.sin(dlat / 2) ** 2 +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dlon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const R = 6371;
    return R * c;
  };

  // Convert POI data to attraction format
  const convertPoisToAttractions = (pois) => {
    return pois.map((poi) => ({
      id: poi.id || `poi-${Math.random().toString(36).substr(2, 9)}`,
      name: poi.properties.name || poi.title || "Unnamed Attraction",
      category: poi.properties.poi_category || [""],
      distance: haversine(poi.geometry.coordinates, tripData?.startCoords) || 0,
      coords: poi.geometry.coordinates,
      description: poi.description || "",
    }));
  };

  // Fetch POIs from starting point and generate itinerary
  const fetchPOIsAndGenerateItinerary = useCallback(async () => {
    if (tripData?.routeCoords.length === 0) return;

    const startPoint = tripData?.startCoords;
    const defaultFilters = [
      "Outdoors",
      "Tourist Attraction",
      "Park",
      "Garden",
      "River",
      "Lake",
      "Forest",
      "Mountain",
      "Island",
    ];

    try {
      setStatusMessage("Fetching POIs from starting point...");
      setIsLoading(true);

      const response = await axios.get(`http://localhost:3000/fetch-pois`, {
        params: {
          lat: startPoint[1],
          lon: startPoint[0],
          filters: defaultFilters,
        },
      });

      const data = response.data;

      if (data.success) {
        // Convert POIs to attraction format
        const formattedAttractions = convertPoisToAttractions(data.pois);
        setAttractions(formattedAttractions);
        setStatusMessage(
          `${formattedAttractions.length} attractions found. Generating itinerary...`
        );

        // Generate itinerary with the fetched POIs
        const itineraryResponse = await axios.post(
          `http://localhost:3000/generate-itinerary`,
          {
            destination: "Blue Mountains",
            pois: data.pois,
          }
        );

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
  }, []);

  // Parse coordinates from text
  const parseCoordinates = (text) => {
    try {
      const parsedCoords = text
        .split(";")
        .map((coordPair) => coordPair.trim())
        .filter((coordPair) => coordPair.length > 0)
        .map((coordPair) => {
          const [lng, lat] = coordPair
            .split(",")
            .map((coord) => parseFloat(coord.trim()));
          if (isNaN(lng) || isNaN(lat)) {
            throw new Error("Invalid coordinate format");
          }
          return [lng, lat];
        });

      if (parsedCoords.length < 2) {
        throw new Error(
          "At least two coordinates (start and end) are required"
        );
      }

      return parsedCoords;
    } catch (error) {
      console.error(`Error parsing coordinates: ${error.message}`);
      return null;
    }
  };

  // Get directions function
  const getDirections = useCallback(
    async (coords) => {
      if (!coords || coords.length < 2 || !mapRef.current || !mapInitialized)
        return;

      const coordString = coords.map((coord) => coord.join(",")).join(";");

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
    },
    [mapInitialized]
  );

  // Initialize map
  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    const bounds = new mapboxgl.LngLatBounds();
    tripData?.routeCoords.forEach((coord) => bounds.extend(coord));

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
    });

    mapRef.current.fitBounds(bounds, { padding: 50 });

    mapRef.current.on("load", () => {
      // Add source and layer for the route
      mapRef.current.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [],
          },
        },
      });

      mapRef.current.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#FF4013", "line-width": 5 },
      });
      setMapInitialized(true);
      getDirections(tripData?.routeCoords);
      // Fetch POIs and generate itinerary when map is initialized
      fetchPOIsAndGenerateItinerary();
    });

    return () => {
      mapRef.current.remove();
    };
  }, []); // Only run once on component mount

  // Update markers and get directions when coordinates change
  useEffect(() => {
    if (!mapRef.current || !mapInitialized) return;

    // Clear existing markers
    const markers = document.getElementsByClassName("mapboxgl-marker");
    while (markers[0]) {
      markers[0].remove();
    }
    // Add new markers
    tripData?.routeCoords.forEach((coord, index) => {
      new mapboxgl.Marker({
        color:
          index === 0
            ? "#00FF00"
            : index === tripData?.routeCoords.length - 1
            ? "#FF0000"
            : "#0000FF",
      })
        .setLngLat(coord)
        .addTo(mapRef.current);
    });
    // Fit bounds to include all coordinates
    const bounds = new mapboxgl.LngLatBounds();
    tripData?.routeCoords.forEach((coord) => bounds.extend(coord));
    mapRef.current.fitBounds(bounds, { padding: 50 });

    // Update directions and itinerary
    getDirections(tripData?.routeCoords);
    fetchPOIsAndGenerateItinerary();
  }, [mapInitialized, tripData]);

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
    const attractionMarkers = document.querySelectorAll(".attraction-marker");
    attractionMarkers.forEach((marker) => marker.remove());

    // Add attraction markers to the map
    attractions.forEach((attraction) => {
      if (attraction.lat && attraction.lon) {
        const markerElement = document.createElement("div");
        markerElement.className = "attraction-marker";
        markerElement.style.width = "15px";
        markerElement.style.height = "15px";
        markerElement.style.borderRadius = "50%";
        markerElement.style.backgroundColor = "#2196F3";
        markerElement.style.border = "2px solid white";

        new mapboxgl.Marker(markerElement)
          .setLngLat([attraction.lon, attraction.lat])
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<strong>${attraction.name}</strong><br>${attraction.category}`
            )
          )
          .addTo(mapRef.current);
      }
    });
  }, [attractions, mapInitialized]);

  return (
    <div className="wrapper">
      <div className="left-content">
        <Options />
        <AttractionBoxes
          attractions={attractions}
          onAddToRoute={handleAddToRoute}
        />
      </div>
      <div className="right-content">
        <Overview pois={attractions} />
        <Itinerary isLoading={isLoading} />

        {/*
          <SelectedAttractions 
            attractions={selectedAttractions} 
            onRemove={(attraction) => {
              setSelectedAttractions(prev => prev.filter(a => a.id !== attraction.id));
            }}
          /> */}
      </div>

      <div ref={mapContainerRef} className="map" />
    </div>
  );
};

export default Trip;
