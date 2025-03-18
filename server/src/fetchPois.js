import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

// Route to fetch POIs from Mapbox
const fetchPois = async (req, res) => {

  const { lat, lon, filters } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ success: false, message: "Latitude and longitude are required" });
  }
  // Calculate the bounding box (search radius of 1km)
  const radiusKm = 1;
  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lon);
  const latDelta = radiusKm / 110.57;
  const lonDelta = radiusKm / (111.32 * Math.cos(latNum * (Math.PI / 180)));
  const bbox = `${lonNum - lonDelta},${latNum - latDelta},${lonNum + lonDelta},${latNum + latDelta}`;

  // Default filters if none are provided
  const defaultCategories = "Outdoors,Tourist Attraction,Park,Garden,River,Lake,Forest,Mountain,Island";
  const categoryFilters = Array.isArray(filters) && filters.length > 0 ? filters.join(',') : defaultCategories;
  const categories = categoryFilters.split(',').join(',');

  const apiUrl = `https://api.mapbox.com/search/searchbox/v1/category/${categories}?bbox=${bbox}&limit=25&access_token=${process.env.MAPBOX_API_KEY}`;

  try {
    console.log("Fetching POIs from Mapbox...");
    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.log("Error fetching POIs");
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // Store POIs as a JSON file and return to client
    const data = await response.json();

    res.json({
      success: true,
      message: `${data.features.length} POIs successfully retrieved`,
      pois: data.features
    });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { fetchPois };
