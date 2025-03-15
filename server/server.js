import express from 'express';
import cors from 'cors';
import { fetchPois } from './src/fetchPois.js';

const corsOptions =  {
  origin: ["http://localhost:5173"],
};

const app = express();
const port = 3000;

app.use(cors(corsOptions))
app.use(express.json())

// Define routes
app.get('/fetch-pois', fetchPois);

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
