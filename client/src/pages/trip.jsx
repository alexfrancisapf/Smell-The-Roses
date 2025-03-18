import { useRef, useEffect, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import AttractionBoxes from "../components/trip/attractions/nearbyattractions";
import axios from "axios";
import React, { useContext } from "react";
import { TripContext } from "../context/TripContext";
import "./trip.css";
import Options from "../components/trip/options";
import Overview from "../components/trip/overview";
import Itinerary from "../components/trip/itinerary";
import { getDirections } from "../utils/getDirections";
import { getDistance } from "../utils/getDistance";
import { getScenicRoute } from "../utils/getScenicRoute";
import { getPois } from "../utils/getPois";

const Trip = () => {
    const { tripData, setTripData } = useContext(TripContext);
    const mapRef = useRef();
    const mapContainerRef = useRef();

    // Map initialization flag
    const [mapInitialized, setMapInitialized] = useState(false);

    // State for attractions and itinerary
    const [attractions, setAttractions] = useState([]);
    const [generatedItinerary, setGeneratedItinerary] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_API_KEY;

    // Initialise map
    useEffect(() => {
        mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

        const bounds = new mapboxgl.LngLatBounds();
        tripData?.routeData.forEach((poi) => bounds.extend(poi.coord));

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/streets-v11",
        });
        mapRef.current.fitBounds(bounds, { padding: 50 });
        mapRef.current.on("load", async () => {
            try {
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

                // Fetch POIs and set trip data
                getInitialPois();
                setMapInitialized(true);

            } catch (error) {
                console.error('Error loading map or fetching data:', error);
            }
        });
        return () => {
            mapRef.current.remove();
        };
    }, []);

    // Get POIs and set trip data
    const getInitialPois = async () => {
            setIsLoading(true);

            const pois = await getPois(tripData?.startCoords);
            const formattedAttractions = convertPoisToAttractions(pois);
            setAttractions(formattedAttractions);

            // Add all POIs to the trip data (between the start and end)
            const updatedRouteData = [
                tripData?.routeData[0],
                ...pois.map((poi) => ({
                    coord: poi.geometry.coordinates,
                    name: poi.properties.name,
                })),
                tripData?.routeData[tripData?.routeData.length - 1],
            ];
            // Update the tripData state
            setTripData((prevTripData) => ({
                ...prevTripData,
                routeData: updatedRouteData,
            }));

            setIsLoading(false);
    };

    // Update the map every time tripData changes
    useEffect(() => {
        const updateMap = async () => {
            if (!mapRef.current) {
                console.error("Map is not initialized");
                return;
            }

            // Get scenic route
            const routeCoords = tripData?.routeData.flat().map(poi => poi.coord);
            const scenicRouteCoords = await getScenicRoute(await getDirections(routeCoords));
            const scenicRoute = await getDirections(scenicRouteCoords);

            // Clear existing markers
            const markers = document.getElementsByClassName("mapboxgl-marker");
            while (markers[0]) {
                markers[0].remove();
            }
            // Add new markers
            scenicRouteCoords.forEach((coord, index) => {
                new mapboxgl.Marker({
                    color:
                        index === 0
                            ? "#00FF00"
                            : index === scenicRoute.length - 1
                            ? "#FF0000"
                            : "#0000FF",
                })
                    .setLngLat(coord)
                    .addTo(mapRef.current);
            });
            // Fit bounds to include all coordinates
            const bounds = new mapboxgl.LngLatBounds();
            tripData?.routeData.forEach((poi) => bounds.extend(poi.coord));
            mapRef.current.fitBounds(bounds, { padding: 50 });

            // Update the map with new directions
            mapRef.current.getSource("route")?.setData({
                type: "Feature",
                properties: {},
                geometry: scenicRoute,
            });  
        };
        if (tripData?.routeData?.length > 0) {
            updateMap();
        }
    }, [mapInitialized, tripData]);

    // Convert POI data to attraction format
    const convertPoisToAttractions = (pois) => {
        return pois.map((poi) => ({
            id: poi.id || `poi-${Math.random().toString(36).substr(2, 9)}`,
            name: poi.properties.name || poi.title || "Unnamed Attraction",
            category: poi.properties.poi_category || [""],
            distance: getDistance(poi.geometry.coordinates, tripData?.startCoords) || 0,
            coords: poi.geometry.coordinates,
            description: poi.description || "",
        }));
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
                <AttractionBoxes attractions={attractions} />
            </div>
            <div className="right-content">
                <Overview />
                <Itinerary isLoading={isLoading} />
            </div>

            <div ref={mapContainerRef} className="map" />
        </div>
    );
};

export default Trip;
