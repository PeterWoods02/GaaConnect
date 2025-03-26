import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/homePage.js';
import CreateTeam from './pages/createTeamPage.js';
import AddTeam from './pages/addTeam.js';
import AddPlayer from './pages/addPlayer.js';
import Calendar from './pages/calendar.js';
import MatchDetails from './pages/matchDetails.js';
import MatchDay from './pages/matchDay.js';  
import SelectTeam from './pages/selectTeam.js';
import SelectMatch from './pages/selectMatch.js';
import PlayerManagement from './pages/playerManagement';
import ManageTeams from './pages/manageTeams.js';  
import PlayerStats from './pages/playerStats.js';
import DisplayTeam from './pages/displayTeam.js';
import FanPage from './pages/fanMatchPage.js';
import FanScorePage from './pages/fanScorePage.js';
import SiteHeader from './components/siteHeader/index.js';


const App = () => {
  return (
    <Router>
      <div>
        <SiteHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/createTeam/:matchId" element={<CreateTeam />} />
          <Route path="/addTeam" element={<AddTeam />}/>
          <Route path="/addPlayer" element={<AddPlayer />}/>
          <Route path="/calendar" element={<Calendar />}/>
          <Route path="/manageTeams/:teamId" element={<ManageTeams />}/>
          <Route path="/selectTeam" element={<SelectTeam />} />
          <Route path="/fanPage/match/:matchId" element={<FanPage />} />
          <Route path="/fanScorePage" element={<FanScorePage />} />
          <Route path="/selectMatch" element={<SelectMatch />} />
          <Route path="/playerManagement/:teamId" element={<PlayerManagement/>} />
          <Route path="/match/:id" element={<MatchDetails />}/>
          <Route path="/match/live/:id" element={<MatchDay />} /> 
          <Route path="/playerStats" element={<PlayerStats />}/>
          <Route path="/match/team/:id" element={<DisplayTeam />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
