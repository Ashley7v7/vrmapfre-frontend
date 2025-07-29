// src/App.jsx
// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Login from './pages/Login';
import IngenieroDashboard from './pages/IngenieroDashboard';
import SuscriptorDashboard from './pages/SuscriptorDashboard';
import TablaVisitas from './components/TablaVisitas';
import Itinerario from './components/Itinerario';

function App() {
  return (
    <Router>
      {/* Toast global visible en toda la app */}
      <Toaster position="bottom-right" reverseOrder={false} />
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/ingeniero-dashboard" element={<IngenieroDashboard />} />
        <Route path="/suscriptor-dashboard" element={<SuscriptorDashboard />} />
        <Route path="/tabla-visitas" element={<TablaVisitas />} />
      </Routes>
    </Router>
  );
}



export default App;

