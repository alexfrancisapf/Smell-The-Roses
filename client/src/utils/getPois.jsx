import axios from "axios";

export const getPois = async (coords, filters) => {
    try {
        const response = await axios.get(`http://localhost:3000/fetch-pois`, {
            params: {
                lat: coords[1],
                lon: coords[0],
                filters: filters
            },
        });
        const data = response.data;

        if (!data.success) {
            console.error("Error fetching POIs");
            return null;
        }  
        return data.pois;
    } 
    catch (error) {
        console.error('Error fetching POIs:', error);
        return null;
    } 
};