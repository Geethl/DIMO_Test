import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AboutContact from './pages/AboutContact';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutContact />} />
            <Route path="/admin" element={<AdminDashboard />} />
            {/* Other routes will be added here */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
