# Smell The Roses <img src="https://github.com/user-attachments/assets/8e1f8428-5523-4e34-87ea-bf0776952849" width="30px" />

### Introducing Smell The Roses
Smell The Roses is a travel planning website designed to take the stress out of your journey, so you can focus on the adventure. With an easy-to-use interface, users can input a starting point and destination, select personalised filters, and generate the most scenic route tailored to their preferences.

But that's not all! The website also provides an AI-generated itinerary that offers personalised trip details and suggests nearby places of interest. Whether you're looking for hidden gems or iconic spots, you can customise your route by adding or removing places along the way to make your journey even more unforgettable.

Leveraging the power of MapBox API for interactive maps and OpenAI API for dynamic itinerary generation, Smell The Roses ensures that your travel experience is as unique and enjoyable as the destinations you’ll visit.

## Features
| **Feature**                    | **Description**                                                                                 |
|---------------------------------|-------------------------------------------------------------------------------------------------|
| **Interactive Map**             | Displays the user’s route along with places of interest                                         |
| **Custom Filters**              | Users can select filters to define the kind of scenic route they want *(e.g. nature spots, coastal routes)* |
| **AI-Generated Itinerary**      | Uses OpenAI's API to create a custom itinerary based on the chosen route and filters            |
| **Dynamic Route Adjustments**   | Users can add or remove places of interest along their route                                    |
| **Export into KML**             | Allows users to export their route as a KML file to import it into Google Maps                  |

## Preview
### Landing Page
![landing](https://github.com/user-attachments/assets/afa7dd93-40f9-4d7d-92ee-bf5332351edb)

### Trip View
![main](https://github.com/user-attachments/assets/0de86f99-c6ff-4a35-a76e-ac02494d486d)

## Tech Stack
### Frontend
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) 
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)

### Backend
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)

### Database & Authentication
![Firebase](https://img.shields.io/badge/firebase-a08021?style=for-the-badge&logo=firebase&logoColor=ffcd34)

## Contributors
Smell the Roses was developed as part of UNIHACK 2025. 

This project was made possible by the contributions of the following team members:

| <img src="https://github.com/rach-leung.png" width="100px" /> | <img src="https://github.com/isopa.png" width="100px" /> | <img src="https://github.com/alexfrancisapf.png" width="100px" /> | <img src="https://github.com/EthanL285.png" width="100px" /> |
|--------------------------------------------------------------|---------------------------------------------------------|---------------------------------------------------------------|------------------------------------------------------------|
| [Rachel Leung](https://github.com/rach-leung)                | [Joshua Budiman](https://github.com/isopa)               | [Alex Francis](https://github.com/alexfrancisapf)             | [Ethan Leffers](https://github.com/EthanL285)               |

## Installation

### 1. Clone Repository
To get started, clone this repository to your local machine:
```bash
git clone https://github.com/EthanL285/Smell-The-Roses.git
```
### 2. Install Dependencies
This project consist of both a client and server. Install the necessary dependencies for each:

- Navigate to the `client` directory and install dependencies:
```bash
cd client
npm install
```
- Naviagte to the `server` directory and install dependencies:
```bash
cd server
npm install
```

### 3. Setup API Keys
You will need to obtain API keys to interact with various services:

| **Service**      | **Description**                                                    |
|------------------|--------------------------------------------------------------------|
| [**MapBox API**](https://www.mapbox.com/)   | Essential for the interactive map                                  |
| [**OpenAI API**](https://openai.com/)       | Optional, but enables AI-generated itineraries for trip planning    |
| [**Firebase**](https://firebase.google.com/) | Optional, but enables features like user authentication and data storage |

Once you have your API keys, proceed to the next step

### 4. Configure Environment Variables
Create two `.env` files for the client and server configurations:

- In the `client/src` directory, create a `.env` file with the following content:
```bash
VITE_MAPBOX_API_KEY=your_mapbox_api_key
```

- In the `server/src` directory, create a `.env` file with the following content:
```bash
OPEN_AI_KEY=your_openai_api_key
MAPBOX_API_KEY=your_mapbox_api_key
```

### 4. Run the Application
Now that everything is set up, you can run the website! 

Open two terminal windows *(one for the client and one for the server)* and run the following command in each:
```bash
npm run dev
```

This will start both the frontend and backend. Open your browser and navigate to `http://localhost:5173` to view the website. 

Enjoy planning your next adventure! 😊

