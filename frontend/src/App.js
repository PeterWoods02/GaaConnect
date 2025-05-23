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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ContactAdmin from './pages/contactAdmin.js';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div>
          <SiteHeader />
          <ToastContainer position="top-right" autoClose={4000} hideProgressBar />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/managerSignup" element={<ManagerSignupPage />} />
            <Route path="/contactAdmin" element={<ContactAdmin />} />


            {/* Protected Routes */}
            <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
            <Route path="/fanPage/match/:matchId" element={<ProtectedRoute><FanPage /></ProtectedRoute>} />
            <Route path="/fanScorePage" element={<ProtectedRoute><FanScorePage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/playerStats" element={<ProtectedRoute><PlayerStats /></ProtectedRoute>} />
            <Route path="/match/team/:id" element={<ProtectedRoute><DisplayTeam /></ProtectedRoute>} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/addTeam" element={<ProtectedRoute roles={['admin', 'coach', 'manager']}><AddTeam /></ProtectedRoute>} />
            <Route path="/addPlayer" element={<ProtectedRoute roles={['admin', 'coach', 'manager']}><AddPlayer /></ProtectedRoute>} />
            <Route path="/createTeam/:matchId" element={<ProtectedRoute roles={['admin', 'coach', 'manager']}><CreateTeam /></ProtectedRoute>} />
            <Route path="/createTeam/default/:teamId" element={<ProtectedRoute roles={['admin', 'coach', 'manager']}><CreateTeam /></ProtectedRoute>} />
            <Route path="/manageTeams/:teamId" element={<ProtectedRoute roles={['admin', 'coach', 'manager']}><ManageTeams /></ProtectedRoute>} />
            <Route path="/playerManagement/:teamId" element={<ProtectedRoute roles={['admin', 'coach', 'manager']}><PlayerManagement /></ProtectedRoute>} />
            <Route path="/match/:id" element={<ProtectedRoute><MatchDetails /></ProtectedRoute>} />
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
