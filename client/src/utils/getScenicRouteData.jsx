import * as turf from '@turf/turf';
import { getPois } from "./getPois";
import { getDirections } from "./getDirections";
import { getDistance } from "./getDistance";

/** Note: getDirections() returns an object containing:
 *      coordinates: [[lat,lon], ...]
 *      type: "LineString"
 * 
 * How Scenic Routes are Calculated
 *      1. Get route from start to destination
 *      2. Divide the route into 5 sections
 *      3. Request POIs for each section
 *      4. Combine and sort (remove duplicates and sort based on their position/distance along the route)
 *      5. Select 23 of these unique POIs and display them on the map
 *
 * @param {number[]} start - [lat, lon]
 * @param {number[]} end - [lat, lon]
 * @returns {{ name: string, coords: number[], category: string[] }[]}
 * 
 * The scenic route which is an array of objects containing:
 *      - coords: The POI location [lon, lat]
 *      - name: The POI name
 *      - category: The categories of the POI
 */

export const getScenicRouteData = async (start, end, filters) => {
    // Get route from start to destination and divide into 5 sections
    const response = await getDirections([start, end]);
    const initialRoute = response.directions;
    const initialRouteDivided = getEvenlySpacedPoints(initialRoute.coordinates, 5);

    // Get POIs for each section of the route
    const scenicPois = (await Promise.all(initialRouteDivided.map(coord => getPois(coord, filters))))
                        .filter(pois => pois.length > 0);

    // If no POIs are found
    if (scenicPois.length == 0) {
        return [];
    }
    const scenicPoiData = scenicPois.flat().map(poi => ({
        name: poi.properties.name,
        coord: [poi.properties.coordinates.latitude, poi.properties.coordinates.longitude],
        category: poi.properties.poi_category
    }));
    // Remove duplicate POIs and sort based on their position along the route
    const uniqueScenicPoiData = removeDuplicates(scenicPoiData);
    const sortedScenicPoiData = sortPOIsByPosition(uniqueScenicPoiData, initialRoute.coordinates);

    // Select 23 evenly spread coordinates along the scenic route
    const scenicRouteCoords =  getEvenlySpacedPoints(sortedScenicPoiData.map((poi) => poi.coord), 23);

    // For each coordinate, select a unique POI that is the closest
    const filteredScenicPOIs = [];
    const selectedPOINames = new Set();

    scenicRouteCoords.forEach(coord => {
        const closestPoi = getClosestPoi(coord, sortedScenicPoiData, selectedPOINames);
        if (closestPoi) {
            filteredScenicPOIs.push(closestPoi);
            selectedPOINames.add(closestPoi.name);
        }
    });

    return filteredScenicPOIs.map(poi => ({
        name: poi.name,
        coord: [poi.coord[1], poi.coord[0]], // Convert [lat, lon] to [lon, lat]
        category: poi.category
    }));
};

/**
 * Finds the closest unique POI to the given coordinate
 * 
 * @param {number[]} coord - The reference coordinate [lat, lon]
 * @param {{ name: string, coord: number[], category: string[] }} pois - The list of POIs
 * @param {Set<string>} selectedPOINames - A set of POI names that have already been selected
 * @returns {{ name: string, coord: number[], category: string[] } | null} The closest unique POI or null if none found
 * 
 */
const getClosestPoi = (coord, pois, selectedPOINames) => {
    let closestPoi = null;
    let minDistance = Infinity;

    pois.forEach(poi => {
        if (selectedPOINames.has(poi.name)) return; 

        const distance = getDistance(coord, poi.coord);
        if (distance < minDistance) {
            minDistance = distance;
            closestPoi = poi;
        }
    });
    return closestPoi;
};

/**
 * Generates an array of evenly spaced points along a given route
 *
 * @param {number[][]} coordinates - An array of coordinates [[lat, lon], ...] representing a route
 * @param {number} numPoints - The number of evenly spaced points to generate along the route
 * @returns {number[][]} An array of evenly spaced coordinates [[lat, lon], ...]
 * 
 */
const getEvenlySpacedPoints = (coordinates, numPoints) => {
    // Calculate total distance
    let totalDistance = 0;
    for (let i = 0; i < coordinates.length - 1; i++) {
        const from = turf.point([coordinates[i][0], coordinates[i][1]]);
        const to = turf.point([coordinates[i + 1][0], coordinates[i + 1][1]]);
        totalDistance += turf.distance(from, to);
    }
    // Get 5 evenly spaced coordinates
    const interval = totalDistance / (numPoints - 1);
    const evenlySpacedPoints = [];
    let currentDistance = 0;

    // Add start coordinate
    evenlySpacedPoints.push(coordinates[0]);

    // Find evenly spaced coordinates
    for (let i = 1; i < coordinates.length; i++) {
        const from = turf.point([coordinates[i - 1][0], coordinates[i - 1][1]]);
        const to = turf.point([coordinates[i][0], coordinates[i][1]]);
        const segmentDistance = turf.distance(from, to);

        // Check if this segment contains a point we are looking for
        currentDistance += segmentDistance;

        if (currentDistance >= interval) {
            // Find the exact position of the point within the current segment
            const ratio = (currentDistance - interval) / segmentDistance;
            const lng = coordinates[i - 1][0] + ratio * (coordinates[i][0] - coordinates[i - 1][0]);
            const lat = coordinates[i - 1][1] + ratio * (coordinates[i][1] - coordinates[i - 1][1]);

            // Store coordinate
            evenlySpacedPoints.push([lng, lat]);
            currentDistance = 0;

            if (evenlySpacedPoints.length === numPoints) break;
        }
    }
    // Add last coordinate
    if (evenlySpacedPoints.length < numPoints) {
        evenlySpacedPoints.push(coordinates[coordinates.length - 1]);
    }
    return evenlySpacedPoints;
}

/**
 * Removes duplicate POIs based on their coordinates
 *
 * @param {{ name: string, coord: number[], category: string[] }[]} pois - An array of POIs with coordinates
 * @returns {{ name: string, coord: number[], category: string[] }[]} An array of unique POIs
 * 
 */
const removeDuplicates = (pois) => {
    const uniquePOIs = [];
    const seen = new Set();

    for (const poi of pois) {
        const coordKey = poi.coord.join(",");
        if (!seen.has(coordKey)) {
            seen.add(coordKey);
            uniquePOIs.push(poi);
        }
    }
    return uniquePOIs;
};

/**
 * Sorts POIs based on their distance from the start of the route
 *
 * @param {{ name: string, coord: number[], category?: string[] }[]} pois - An array of POIs with coordinates
 * @param {number[][]} route - An array of coordinates [[lon, lat], [lon, lat], ...] representing a route
 * @returns {{ name: string, coord: number[], category?: string[] }[]} The POIs sorted by position along the route
 * 
 */
const sortPOIsByPosition = (pois, route) => {
    const startPOI = pois[0];
    const endPOI = pois[pois.length - 1];

    const intermediatePOIs = pois.slice(1, pois.length - 1);
    const sortedIntermediatePOIs = intermediatePOIs.sort((a, b) => {
        const routeStart = turf.point(route[0]);
        const distA = turf.distance(routeStart, turf.point(a.coord));
        const distB = turf.distance(routeStart, turf.point(b.coord));

        return distA - distB;
    });
    return [startPOI, ...sortedIntermediatePOIs, endPOI];
};
