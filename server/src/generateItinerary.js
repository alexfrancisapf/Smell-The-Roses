import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});

// Create prompt for itinerary
const createPrompt = (destination, pois) => {
  const poiNames = pois.map(poi => poi.properties.name);
  let prompt = `Create a detailed itinerary for a trip to ${destination}. The itinerary should have any five of the following points of interest:`;

  poiNames.forEach(name => {
    prompt += `\n- ${name}`;
  });

  prompt += `
  Format the itinerary as follows (do not include brackets in the final output):

  [Category]: [POI Name]  
  [Description of POI]

  [Category]: [POI Name]  
  [Description of POI]

  ...

  Guidelines:
  - Only select POIs from the provided list
  - Assign an appropriate category to each POI (e.g., Breakfast, Viewpoint, Park, Historical Site, Landmark, Museum, Activity, Restaurant, etc).
  - Make sure descriptions are engaging, informative, and fit the assigned category.`;

  return prompt;
};

// Generates an itinerary for a trip
const generateItinerary = async (req, res) => {

  console.log("Generating Itinerary");

  const { destination, pois } = req.body;
  const prompt = createPrompt(destination, pois);

  if (!prompt) {
    return res.status(400).json({ error: "No prompt provided" });
  }

  try {
    console.log("Generating Itinerary!");
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: prompt },
      ],
    });
    console.log("Finished Generating Itinerary!");

    res.json({
      success: true,
      message: `Itinerary Generation Completed`,
      itinerary: completion.choices[0].message.content,
    });

  } catch (error) {
    console.error("Error generating text:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { generateItinerary }
