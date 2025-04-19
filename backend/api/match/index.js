import express from 'express';
import Match from './matchModel.js';
import Team from '../team/teamModel.js';
import User from '../user/userModel.js';
import Statistics from '../statistics/statisticsModel.js';
import mongoose from 'mongoose';
import Event from '../event/eventModel.js';
import { authenticateToken } from '../../middleware/auth.js';
import { checkRole } from '../../middleware/checkRole.js';

const router = express.Router();

// Get all matches
router.get('/', authenticateToken, async (req, res) => {
    try {
      const { role, team } = req.user;

    let query = {};

    if (role !== 'admin') {
      if (!team || team.length === 0) {
        return res.status(403).json({ message: 'You are not assigned to a team.' });
      }

      const teamIds = Array.isArray(team) ? team : [team];
      query = { team: { $in: teamIds } };
    }
        const matches = await Match.find()
            .populate('statistics')  
            .populate('team')      
            .populate('events')   
            

        res.status(200).json(matches);
    } catch (error) {
        console.error('Error fetching matches:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET match by ID
router.get("/:id", async (req, res) => {
    try {
      const match = await Match.findById(req.params.id);
      if (!match) return res.status(404).json({ message: "Match not found" });
  
      res.json(match);
    } catch (error) {
      console.error("Error fetching match details:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  

// Create a match or fixture
router.post('/', authenticateToken, checkRole('manager', 'coach', 'admin'), async (req, res) => {
    try {
        const { matchTitle, date, location, opposition, score, results, statistics, team, admissionFee, status } = req.body;

        // Ensure the team is a valid 
        const existingTeam = await Team.findById(team);
        if (!existingTeam) {
            return res.status(400).json({ message: 'Invalid team reference' });
        }

        // if no status, default to 'upcoming' for a fixture
        const matchData = {
            matchTitle,
            date,
            location,
            opposition,
            score,
            results,
            statistics,
            team,
            admissionFee,
            status: status || 'upcoming',  
        };

        const newMatch = new Match(matchData);
        await newMatch.save();

        res.status(201).json(newMatch);
    } catch (error) {
        console.error('Error creating match:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a match
router.put('/:id', authenticateToken, checkRole('manager', 'coach', 'admin'), async (req, res) => {
    try {
      const {
        matchTitle, date, location, opposition, score,
        results, statistics, team, admissionFee, status,
        player, startTime 
      } = req.body;
  
      if (player) {
        const existingPlayer = await User.findById(playerId);//Check later
        if (!existingPlayer) {
          return res.status(400).json({ message: 'Invalid player reference' });
        }
      }
  
      const updatedMatch = await Match.findByIdAndUpdate(
        req.params.id,
        {
          matchTitle, date, location, opposition, score,
          results, statistics, team, admissionFee, status,
          player, startTime 
        },
        { new: true }
      );
  
      if (!updatedMatch) {
        return res.status(404).json({ message: 'Match not found' });
      }
  
      res.status(200).json(updatedMatch);
    } catch (error) {
      console.error('Error updating match:', error);
      res.status(500).json({ message: 'Failed to update match' });
    }
  });
  
  

// Route to update or create team positions for a match
router.put('/:id/team', authenticateToken, checkRole('manager', 'coach', 'admin'), async (req, res) => {
    const { teamPositions } = req.body; 

    try {
        const match = await Match.findById(req.params.id);

        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }

        // Validate the structure 
        if (!teamPositions || typeof teamPositions !== 'object' || Object.keys(teamPositions).length === 0) {
            return res.status(400).json({ message: 'Invalid or missing teamPositions' });
        }

        // Update the teamPositions 
        match.teamPositions = teamPositions; 

        await match.save();

        res.status(200).json(match);
    } catch (error) {
        console.error('Error updating team positions:', error);
        res.status(500).json({ message: 'Failed to update team positions' });
    }
});

// Get the team for a match
router.get("/:id/squad", async (req, res) => {
    try {
        // Fetch the match by its ID
        const match = await Match.findById(req.params.id);

        if (!match) {
            return res.status(404).json({ message: "Match not found" });
        }

        if (!match.teamPositions || Object.keys(match.teamPositions).length === 0) {
            return res.status(404).json({ message: "No team positions found for this match" });
        }
        res.status(200).json(match.teamPositions);
    } catch (error) {
        console.error("Error fetching team positions:", error);
        res.status(500).json({ message: "Server error" });
    }
});




// Delete a match
router.delete('/:id', authenticateToken, checkRole('manager', 'coach', 'admin'), async (req, res) => {
    try {
        const deletedMatch = await Match.findByIdAndDelete(req.params.id);

        if (!deletedMatch) {
            return res.status(404).json({ message: 'Match not found' });
        }

        res.status(200).json({ message: 'Match deleted successfully' });
    } catch (error) {
        console.error('Error deleting match:', error);
        res.status(500).json({ message: 'Failed to delete match' });
    }
});

//Match lifecyle functions


// Start Match
router.post('/:id/start', authenticateToken, checkRole('manager', 'coach', 'admin'), async (req, res) => {
    try {
      const match = await Match.findById(req.params.id);
  
      if (!match) {
        return res.status(404).json({ message: 'Match not found' });
      }
  
      match.status = 'live';
      match.startTime = Date.now();  
      match.currentTime = 0;
  
      await match.save();
  
      res.status(200).json(match);
    } catch (error) {
      console.error('Error starting match:', error);
      res.status(500).json({ message: 'Failed to start match' });
    }
  });

  router.post('/:id/half-time', authenticateToken, checkRole('manager', 'coach', 'admin'), async (req, res) => {
    try {
      const match = await Match.findById(req.params.id);
  
      if (!match) {
        return res.status(404).json({ message: 'Match not found' });
      }
  
      match.status = 'halfTime';
      match.startTime = null; //pause timer  
      await match.save();
  
      res.status(200).json(match);
    } catch (error) {
      console.error('Error pausing for half-time:', error);
      res.status(500).json({ message: 'Failed to set half-time' });
    }
  });

  router.post('/:id/second-half', authenticateToken, checkRole('manager', 'coach', 'admin'), async (req, res) => {
    try {
      const match = await Match.findById(req.params.id);
  
      if (!match) {
        return res.status(404).json({ message: 'Match not found' });
      }
  
      match.status = 'live';
      match.startTime = Date.now(); 
  
      await match.save();
  
      res.status(200).json(match);
    } catch (error) {
      console.error('Error starting second half:', error);
      res.status(500).json({ message: 'Failed to start second half' });
    }
  });
  router.post('/:id/end', authenticateToken, checkRole('manager', 'coach', 'admin'), async (req, res) => {
    try {
      const match = await Match.findById(req.params.id);
  
      if (!match) {
        return res.status(404).json({ message: 'Match not found' });
      }
  
      match.status = 'fullTime';
      match.startTime = null; 
  
      await match.save();
  
      res.status(200).json(match);
    } catch (error) {
      console.error('Error ending match:', error);
      res.status(500).json({ message: 'Failed to end match' });
    }
  });
  
  

// Update Score
router.post('/:id/score', authenticateToken, checkRole('manager', 'coach', 'admin'), async (req, res) => {
    const { teamGoals, teamPoints, oppositionGoals, oppositionPoints } = req.body;

    try {
        const match = await Match.findById(req.params.id);

        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }

        // Update match score
        if (teamGoals !== undefined) match.score.teamGoals = teamGoals;
        if (teamPoints !== undefined) match.score.teamPoints = teamPoints;
        if (oppositionGoals !== undefined) match.score.oppositionGoals = oppositionGoals;
        if (oppositionPoints !== undefined) match.score.oppositionPoints = oppositionPoints;

        await match.save();

        res.status(200).json(match);
    } catch (error) {
        console.error('Error updating score:', error);
        res.status(500).json({ message: 'Failed to update score' });
    }
});


router.post('/:id/event', authenticateToken, checkRole('manager', 'coach', 'admin'), async (req, res) => {
    const { type, teamId, playerId, minute } = req.body;

    if (teamId && !mongoose.Types.ObjectId.isValid(teamId)) {
        return res.status(400).json({ message: 'Invalid team ID' });
    }
    if (playerId && !mongoose.Types.ObjectId.isValid(playerId)) {
        return res.status(400).json({ message: 'Invalid player ID' });
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid match ID' });
    }

    if (!type || minute === undefined) {
        return res.status(400).json({ message: 'Missing required fields: type or minute' });
    }

    try {
        const match = await Match.findById(req.params.id);
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }

        let player = null;
        if (playerId) {
           player = await User.findById(playerId);
            if (!player) {
                return res.status(404).json({ message: 'Player not found' });
            }
        }

        let team = null;
        if (teamId) {
            team = await Team.findById(teamId);
            if (!team) {
                return res.status(404).json({ message: 'Team not found' });
            }
        }

        const event = new Event({
            match: match._id,
            player: player ? player._id : null,
            team: teamId ? team._id : match.opposition,
            type,
            minute,
        });

        await event.save();

        match.events.push(event._id);

        if (!teamId && !playerId) {
            if (type === 'goal') {
                match.score.oppositionGoals += 1;
            } else if (type === 'point') {
                match.score.oppositionPoints += 1;
            }
        } else {
            if (teamId && team && team._id.toString() === match.team.toString()) {
                if (type === 'goal') {
                    match.score.teamGoals += 1;
                } else if (type === 'point') {
                    match.score.teamPoints += 1;
                }
            } else if (team) {
                if (type === 'goal') {
                    match.score.oppositionGoals += 1;
                } else if (type === 'point') {
                    match.score.oppositionPoints += 1;
                }
            }
        }

        if (playerId && player) {
            // Per match contributions
            if (!match.playerContributions.has(player._id.toString())) {
                match.playerContributions.set(player._id.toString(), {
                    goals: 0,
                    assists: 0,
                    points: 0,
                    yellowCards: 0,
                    redCards: 0
                });
            }

            const contribution = match.playerContributions.get(player._id.toString());

            if (type === 'goal') contribution.goals += 1;
            if (type === 'point') contribution.points += 1;
            if (type === 'yellowCard') contribution.yellowCards += 1;
            if (type === 'redCard') contribution.redCards += 1;

            match.playerContributions.set(player._id.toString(), contribution);

            // Global Player Stats
            let playerStats = await Statistics.findOne({ player: playerId });

            if (!playerStats) {
                playerStats = new Statistics({
                    player: playerId,
                    goals: 0,
                    points: 0,
                    minutes_played: 0,
                    ratings: 0,
                    yellowCards: 0,
                    redCards: 0
                });
            }

            if (type === 'goal') playerStats.goals += 1;
            if (type === 'point') playerStats.points += 1;
            if (type === 'yellowCard') playerStats.yellowCards += 1;
            if (type === 'redCard') playerStats.redCards += 1;

            await playerStats.save();

            if (!player.statistics) {
                player.statistics = playerStats._id;
                await player.save();
            }
        }

        await match.save();

        //  socket 
        const io = req.app.get('io');
        io.to(match._id.toString()).emit('matchUpdate', { type: 'eventUpdate' });

        res.status(200).json({
            message: 'Event logged successfully',
            match,
        });

    } catch (error) {
        console.error('Error logging event:', error);
        res.status(500).json({ message: 'Failed to log event' });
    }
});

//Undo event
router.delete('/:matchId/event/:eventId', authenticateToken, checkRole('manager', 'coach', 'admin'), async (req, res) => {
    const { matchId, eventId } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(matchId) || !mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: 'Invalid match or event ID' });
    }
  
    try {
      const match = await Match.findById(matchId);
      const event = await Event.findById(eventId);
  
      if (!match || !event) {
        return res.status(404).json({ message: 'Match or Event not found' });
      }
  
      // Reverse score updates
      if (event.type === 'goal') {
        if (event.team.toString() === match.team.toString()) {
          match.score.teamGoals = Math.max(0, match.score.teamGoals - 1);
        } else {
          match.score.oppositionGoals = Math.max(0, match.score.oppositionGoals - 1);
        }
      } else if (event.type === 'point') {
        if (event.team.toString() === match.team.toString()) {
          match.score.teamPoints = Math.max(0, match.score.teamPoints - 1);
        } else {
          match.score.oppositionPoints = Math.max(0, match.score.oppositionPoints - 1);
        }
      }
      
  
      // Reverse player contribution
      const playerId = event.player?.toString();
      if (playerId && match.playerContributions.has(playerId)) {
        const contribution = match.playerContributions.get(playerId);
  
        if (event.type === 'goal') contribution.goals -= 1;
        if (event.type === 'point') contribution.points -= 1;
        if (event.type === 'yellowCard') contribution.yellowCards -= 1;
        if (event.type === 'redCard') contribution.redCards -= 1;
  
        // Remove entry if all values are zero
        const allZero = Object.values(contribution).every(val => val === 0);
        if (allZero) {
          match.playerContributions.delete(playerId);
        } else {
          match.playerContributions.set(playerId, contribution);
        }
      }
  
      // update player stats model 
      if (playerId) {
        const playerStats = await Statistics.findOne({ player: playerId });
      
        if (playerStats) {
          if (event.type === 'goal') playerStats.goals -= 1;
          if (event.type === 'point') playerStats.points -= 1;
          if (event.type === 'yellowCard') playerStats.yellowCards -= 1;
          if (event.type === 'redCard') playerStats.redCards -= 1;
      
          await playerStats.save();
        }
      }
      
      // Remove event
      await Event.findByIdAndDelete(eventId);
      match.events.pull(eventId);
  
      await match.save();
      const io = req.app.get('io');
      io.to(match._id.toString()).emit('matchUpdate', { type: 'eventUpdate' });

      return res.status(200).json({ message: 'Event deleted successfully', match });
    } catch (err) {
      console.error('Error deleting event:', err);
      res.status(500).json({ message: 'Failed to delete event' });
    }
  });
  


// Update Statistics
router.post('/:id/statistics', authenticateToken, checkRole('manager', 'coach', 'admin'), async (req, res) => {
    const { playerId, stats } = req.body; // Player's stats like goals, assists, etc.

    try {
        const match = await Match.findById(req.params.id);

        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }

        // Assuming match.statistics is an array of player statistics
        const playerStats = match.statistics.find(stat => stat.player.equals(playerId));

        if (!playerStats) {
            return res.status(404).json({ message: 'Player statistics not found' });
        }

        // Update stats based on the incoming data
        Object.assign(playerStats, stats);

        await match.save();

        res.status(200).json(match);
    } catch (error) {
        console.error('Error updating statistics:', error);
        res.status(500).json({ message: 'Failed to update statistics' });
    }
});


// End Match
router.post('/:id/end', async (req, res) => {
    try {
        const match = await Match.findById(req.params.id);

        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }

        match.status = 'finished';
        await match.save();

        res.status(200).json(match);
    } catch (error) {
        console.error('Error ending match:', error);
        res.status(500).json({ message: 'Failed to end match' });
    }
});

router.get('/:id/events', async (req, res) => {
    try {
      const events = await Event.find({ match: req.params.id })
        .populate('player')
        .populate('team', 'name')
        .sort({ minute: 1 }); 
  
      res.status(200).json(events);
    } catch (error) {
      console.error('Error fetching match events:', error);
      res.status(500).json({ message: 'Failed to fetch match events' });
    }
  });

 

export default router;
