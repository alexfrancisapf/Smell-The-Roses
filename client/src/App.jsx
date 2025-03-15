import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Trip from './pages/trip';
import User from './pages/user';
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/trip" element={<Trip/>}/>
        <Route path="/user" element={<User/>}/>
      </Routes>
    </Router>
  )
}

export default App;