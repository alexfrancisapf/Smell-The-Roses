import axios from 'axios';

/**
 * Generates an itinerary based on the given destination and list of POIs
 *
 * @param {string} destination - The name of the destination
 * @param {{ name: string, coord: number[], category: string[] }[]} pois - An array of POI objects, each containing:
 *   - name {string} - The name of the POI
 *   - imagePath {string} - The file path of the image associated with the POI
 * 
 * @returns {Promise<string|null>} 
 * A promise that resolves to a string representing the generated itinerary, or `null` if there was an error during generation
 * 
 */
export const generateItinerary = async (destination, pois) => {
    try {
        const response = await axios.post('http://localhost:3000/generate-itinerary', {
            destination,
            pois,
        });
        const data = response.data;

        if (!data.success) {
            console.error('Error generating itinerary');
            return null;
        }
        return data.itinerary;    
    } 
    catch (error) {
        console.error('Error generating itinerary:', error);
        if (error.response && error.response.status === 400) {
            return "We couldn't find any points of interest to create your itinerary. Please adjust your filters.";
        }
        return null;
    }
};