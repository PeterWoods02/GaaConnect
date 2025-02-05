import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/homePage.js';
import CreateTeam from './pages/createTeamPage.js';
import AddTeam from './pages/addTeam.js';
import AddPlayer from './pages/addPlayer.js';
import SiteHeader from './components/siteHeader/index.js';

const App = () => {
  return (
    <Router>
      <div>
        <SiteHeader /> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/createTeam" element={<CreateTeam />} />
          <Route path="/addTeam" element={<AddTeam />}/>
          <Route path="/addPlayer" element={<AddPlayer />}/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
