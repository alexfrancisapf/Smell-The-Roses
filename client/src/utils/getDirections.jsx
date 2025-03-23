import axios from "axios";

/**
 * @param {number[][]} coords - An array of coordinates in the form [[lat, lon], [lat, lon], ...]
 * @returns {Promise<{ directions: {coordinates: number[][], type: string}, duration: number, distance: number }>}
 * 
 * A promise that resolves to an object containing:
 *      - directions: A GeoJson object with two properties:
 *          - coordinates: An array of coordinates representing the route
 *          - type: The route geometry type ("LineString")
 *      - duration: Estimated travel time in seconds
 *      - distance: Total distance of the route in meters
 */
export const getDirections = async (coords) => {
    try {
        const response = await axios.post(`http://localhost:3000/get-directions`, { coords });
        const data = response.data;

        if (!data.success) {
            return console.error("No route found between the specified coordinates");
        }  
        const result = {
            directions: data.route,
            duration: data.duration,
            distance: data.distance
        }
        return result;
    }
    catch (error) {
        console.error("Error fetching directions:", error);
    }
}
      