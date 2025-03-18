import express from 'express';
import cors from 'cors';
import { fetchPois } from './src/fetchPois.js';
import { generateItinerary } from './src/generateItinerary.js';
import { getDirections } from './src/getDirections.js';

const corsOptions =  {
  origin: ["http://localhost:5173"],
};

const app = express();
const port = 3000;

app.use(cors(corsOptions))
app.use(express.json())

// Routes
app.get('/fetch-pois', fetchPois);
app.post('/get-directions', getDirections);
app.post('/generate-itinerary', generateItinerary);

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
