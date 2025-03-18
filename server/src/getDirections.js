import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

/** INPUT: Coordinates in the format [[lon, lat], [lon, lat]...]
 *  OUTPUT: JSON Object
 *    - coordinates: [[lon, lat], [lon, lat]...]
 *    - type: "LineString"
 */

// Get directions from Mapbox
const getDirections = async (req, res) => {
  const { coords } = req.body;

  if (!coords || coords.length < 2) {
    return res.status(400).json({ success: false, message: "At least two coordinates are required" });
  }
  // Limit the coordinates to the first 24
  const limitedCoords = [...coords.slice(0, 24), coords[coords.length - 1]];

  // Construct the coordinate string from POIs
  const coordString = limitedCoords
    .map((coord) => coord.join(","))
    .join(";");

  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordString}?geometries=geojson&access_token=${process.env.MAPBOX_API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    if (data.routes && data.routes.length) {
      const route = data.routes[0].geometry;

      // Return JSON response
      return res.json({
        success: true,
        message: "Route successfully retrieved",
        route: route
      });
    } else {
      console.error("No route found between the specified coordinates");
      return res.status(400).json({
        success: false,
        message: "No route found between the specified coordinates"
      });
    }
  } catch (error) {
    console.error("Error fetching directions:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { getDirections };

