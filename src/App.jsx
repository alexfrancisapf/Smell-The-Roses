import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Trip from './pages/trip';
import User from './pages/user';

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