import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/homePage.js';
import CreateTeam from './pages/createTeamPage.js';
import AddTeam from './pages/addTeam.js';
import AddPlayer from './pages/addPlayer.js';
import Calendar from './pages/calendar.js';
import MatchDetails from './pages/matchDetails.js';
import MatchDay from './pages/matchDay.js';  
import SelectTeam from './pages/selectTeam';
import PlayerManagement from './pages/playerManagement';
import ManageTeams from './pages/manageTeams.js';  
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
          <Route path="/calendar" element={<Calendar />}/>
          <Route path="/manageTeams/:teamId" element={<ManageTeams />}/>
          <Route path="/selectTeam" element={<SelectTeam />} />
          <Route path="/playerManagement/:teamId" element={<PlayerManagement/>} />
          <Route path="/match/:id" element={<MatchDetails />}/>
          <Route path="/match/live/:id" element={<MatchDay />} /> 
        </Routes>
      </div>
    </Router>
  );
};

export default App;
