import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

/**
 * Generates an itinerary prompt based on the given destination and list of POIs
 *
 * @param {string} destination - The name of the destination
 * @param {{ name: string, coord: number[], category: string[] }[]} pois - An array of POI objects, each containing:
 *   - name {string} - The name of the POI
 *   - imagePath {string} - The file path of the image associated with the POI

 * @returns {string} A prompt instructing how to generate an itinerary using the given POIs
 * 
 * Note: Prompt only includes 5 POIs in the itinerary, as unfortunately I am not Bill Gates
 * 
 */
const createPrompt = (destination, pois) => {
  if (pois.length == 0) {
    return null;
  }
  let prompt = `Create a detailed itinerary for a trip to ${destination}, choosing from the following POIs:`;

  pois.forEach(poi => {
    prompt += `\n- ${poi.name} (${poi.imagePath})`;
  });

  prompt += `
  Format the itinerary as follows (do not include brackets in the final output):

  [Category]: [POI Name]  
  [Image Path]
  [Description of POI]

  etc...

  Guidelines:
  - Choose 5 POIs from the list
  - Assign the most fitting category from the following: Historical, Natural, Cultural, Leisure, Dining
  - Make sure descriptions are engaging and informative`;

  return prompt;
};

// Generates an itinerary for a trip
const generateItinerary = async (req, res) => {

  console.log("Generating Itinerary");

  const { destination, pois } = req.body;
  const prompt = createPrompt(destination, pois);

  if (!prompt) {
    return res.status(400).json({ error: "No prompt or POIs provided" });
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
