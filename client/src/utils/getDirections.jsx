import axios from "axios";

// Get directions given a list of pois
export const getDirections = async (coords) => {
    try {
        const response = await axios.post(`http://localhost:3000/get-directions`, { coords });
        const data = response.data;

        if (!data.success) {
            return console.error("No route found between the specified coordinates");
        }  
        return data.route;
    }
    catch (error) {
        console.error("Error fetching directions:", error);
    }
}
      