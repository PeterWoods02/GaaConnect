import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/homePage/index.js';
import Players from './pages/playerPage/index.js';
import SiteHeader from './components/siteHeader/index.js';

const App = () => {
  return (
    <Router>
      <div>
        <SiteHeader /> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/players" element={<Players />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
