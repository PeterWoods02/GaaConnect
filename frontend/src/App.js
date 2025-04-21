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
import LoginPage from './pages/loginPage.js';
import ProfilePage from './pages/profilePage.js';
import RegisterPage from './pages/registerPage.js';
import ManagerSignupPage from './pages/managerSignUpPage.js';
import InviteManagerPage from './pages/inviteManagerPage';
import SearchPlayersPage from './pages/searchPlayers.js';
import SiteHeader from './components/siteHeader/index.js';
import { AuthProvider } from './context/authContext.js';
import ProtectedRoute from './context/protectedRoutes.js';
import MessageBox from './components/messageBox/index.js'

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div>
          <SiteHeader />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/fanPage/match/:matchId" element={<FanPage />} />
            <Route path="/fanScorePage" element={<FanScorePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/playerStats" element={<PlayerStats />} />
            <Route path="/match/team/:id" element={<DisplayTeam />} />
            <Route path="/managerSignup" element={<ManagerSignupPage />} />


            {/* Protected Routes */}
            <Route path="/addTeam" element={<ProtectedRoute roles={['admin', 'coach', 'manager']}><AddTeam /></ProtectedRoute>} />
            <Route path="/addPlayer" element={<ProtectedRoute roles={['admin', 'coach', 'manager']}><AddPlayer /></ProtectedRoute>} />
            <Route path="/createTeam/:matchId" element={<ProtectedRoute roles={['admin', 'coach', 'manager']}><CreateTeam /></ProtectedRoute>} />
            <Route path="/manageTeams/:teamId" element={<ProtectedRoute roles={['admin', 'coach', 'manager']}><ManageTeams /></ProtectedRoute>} />
            <Route path="/playerManagement/:teamId" element={<ProtectedRoute roles={['admin', 'coach', 'manager']}><PlayerManagement /></ProtectedRoute>} />
            <Route path="/match/:id" element={<ProtectedRoute roles={['admin', 'coach', 'manager']}><MatchDetails /></ProtectedRoute>} />
            <Route path="/match/live/:id" element={<ProtectedRoute roles={['admin', 'coach', 'manager']}><MatchDay /></ProtectedRoute>} />
            <Route path="/selectMatch" element={<ProtectedRoute roles={['admin', 'coach', 'manager']}><SelectMatch /></ProtectedRoute>} />
            <Route path="/selectTeam" element={<ProtectedRoute roles={['admin', 'coach', 'manager']}><SelectTeam /></ProtectedRoute>} />
            <Route path="/inviteManager" element={ <ProtectedRoute roles={['admin']}> <InviteManagerPage /> </ProtectedRoute>}/>
            <Route path="/searchPlayers" element={ <ProtectedRoute roles={['admin', 'coach', 'manager']}> <SearchPlayersPage /> </ProtectedRoute>}/>
           </Routes>
           <MessageBox />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
