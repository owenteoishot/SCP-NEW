import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import StoryReader from './pages/StoryReader';




function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/stories" element={<StoryReader />} />

      </Routes>
    </div>
  );
}

export default App;
