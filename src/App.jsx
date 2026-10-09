import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './pages/Overview';
import SystemArchitecture from './pages/SystemArchitecture';
import ApiCommunication from './pages/ApiCommunication';
import DatabaseDesign from './pages/DatabaseDesign';
import CachingStrategy from './pages/CachingStrategy';
import MessagingWorkflow from './pages/MessagingWorkflow';
import Scalability from './pages/Scalability';
import BookingSimulation from './pages/BookingSimulation';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Header />
          <div className="content-area">
            <Routes>
              <Route path="/" element={<Navigate to="/overview" replace />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/architecture" element={<SystemArchitecture />} />
              <Route path="/api" element={<ApiCommunication />} />
              <Route path="/database" element={<DatabaseDesign />} />
              <Route path="/caching" element={<CachingStrategy />} />
              <Route path="/messaging" element={<MessagingWorkflow />} />
              <Route path="/scalability" element={<Scalability />} />
              <Route path="/simulation" element={<BookingSimulation />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
