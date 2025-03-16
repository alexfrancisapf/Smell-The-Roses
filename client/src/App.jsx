import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Trip from './pages/Trip';
import Login from './pages/Login';

import { TripProvider } from './context/TripContext';
import './App.css'

function App() {
  return (
    <TripProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/trip" element={<Trip/>}/>
          <Route path="/user" element={<Login/>}/>

        </Routes>
      </Router>
    </TripProvider>
  )
}

export default App;