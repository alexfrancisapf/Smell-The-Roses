import * as turf from '@turf/turf';
import { getPois } from "./getPois";
import { getDirections } from "./getDirections";

/** Input: Route
 *      coordinates: [[lat,lon], [lat,lon], [lat,lon]...]
 *      type: "LineString"
 * 
 *  Output:
 *      [[lon, lat], [lon, lat], [lon, lat]...]
 */

/** How Scenic Routes are Calculated
 *      1. Get route from start to destination
 *      2. Divide the route into 5 sections
 *      3. Request POIs for each section
 *      4. Combine and sort (remove duplicates and sort based on their position/distance along the route)
 *      5. Pick 23 of these unique POIs and display them on the map
 */

// Returns the coordinates of the scenic POIs
export const getScenicRoute = async (route) => {
    const coords = getEvenlySpacedPoints(route.coordinates, 5);

    const pois = await Promise.all(coords.map(coord => getPois(coord)));
    const poiCoords = pois.flat().map(poi => [poi.properties.coordinates.latitude, poi.properties.coordinates.longitude]);

    const uniquePoiCoords = removeDuplicates(poiCoords);
    const sortedPoiCoords = sortPOIsByPosition(uniquePoiCoords, route.coordinates);
    const scenicPoiCoords = getEvenlySpacedPoints(sortedPoiCoords, 23);

    return scenicPoiCoords.map(([lat, lon]) => [lon, lat]);
};

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

// Removes duplicate coordinates
const removeDuplicates = (coords) => {
    const uniqueCoords = [];
    const seen = new Set();

    for (const coord of coords) {
        if (!seen.has(coord)) {
            seen.add(coord);
            uniqueCoords.push(coord);
        }
    }
    return uniqueCoords;
};

// Sort POIs based on their position along the route (distance)
const sortPOIsByPosition = (pois, route) => {
    // Preserve start and end coordinates
    const startPOI = pois[0];
    const endPOI = pois[pois.length - 1];

    const intermediatePOIs = pois.slice(1, pois.length - 1);
    const sortedIntermediatePOIs = intermediatePOIs.sort((a, b) => {
        const routeStart = turf.point([route[0][0], route[0][1]]);
        const distanceA = turf.point([a[0], a[1]]);
        const distanceB = turf.point([b[0], b[1]]);

        const distA = turf.distance(routeStart, distanceA);
        const distB = turf.distance(routeStart, distanceB);

        return distA - distB;
    });
    return [startPOI, ...sortedIntermediatePOIs, endPOI];
};