import express from 'express';
import Match from './matchModel.js';
import Team from '../team/teamModel.js';
import Player from '../player/playerModel.js';
import Statistics from '../statistics/statisticsModel.js';

const router = express.Router();

// Get all matches
router.get('/', async (req, res) => {
    try {
        const matches = await Match.find()
            .populate('statistics')  
            .populate('team')         
            

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
router.post('/', async (req, res) => {
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
router.put('/:id', async (req, res) => {
    try {
      const { matchTitle, date, location, opposition, score, results, statistics, team, admissionFee, status, player } = req.body;
  
      // If a player is provided, ensure it is valid
      if (player) {
        const existingPlayer = await Player.findById(player._id);
        if (!existingPlayer) {
          return res.status(400).json({ message: 'Invalid player reference' });
        }
      }
  
      const updatedMatch = await Match.findByIdAndUpdate(
        req.params.id,
        { matchTitle, date, location, opposition, score, results, statistics, team, admissionFee, status, player },
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
router.put('/:id/team', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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
router.post('/:id/start', async (req, res) => {
    try {
        const match = await Match.findById(req.params.id);

        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }

        match.status = 'live';
        match.currentTime = 0; // Reset the timer to 0 minutes
        await match.save();

        res.status(200).json(match);
    } catch (error) {
        console.error('Error starting match:', error);
        res.status(500).json({ message: 'Failed to start match' });
    }
});

// Update Score
router.post('/:id/score', async (req, res) => {
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


// Log Event (Goal, Card, Substitution)
router.post('/:id/event', async (req, res) => {
    const { type, team, playerId, minute, description, isGoal } = req.body; 

    try {
        const match = await Match.findById(req.params.id);
        const player = await Player.findById(playerId).populate('statistics');

        if (!match || !player) {
            return res.status(404).json({ message: 'Match or player not found' });
        }

        // Log the event (e.g., Goal, Card, etc.)
        const event = { type, team, player: playerId, minute, description };
        match.events.push(event);

        // Update match score if it's a goal
        if (isGoal) {
            if (team === match.team._id.toString()) {
                match.score.teamGoals += 1; 
            } else {
                match.score.oppositionGoals += 1; 
            }

            // Update player contribution in this match
            if (!match.playerContributions.has(playerId)) {
                match.playerContributions.set(playerId, { goals: 0, points: 0 });
            }

            const playerContribution = match.playerContributions.get(playerId);
            playerContribution.goals += 1;  
            match.playerContributions.set(playerId, playerContribution); 

            // Update the player's lifetime stats
            player.statistics.goals += 1;
            await player.statistics.save(); 
        }

        await match.save(); // Save the match after the event

        res.status(200).json({
            message: 'Event logged and stats updated successfully',
            match,
            playerStats: player.statistics
        });
    } catch (error) {
        console.error('Error logging event:', error);
        res.status(500).json({ message: 'Failed to log event' });
    }
});



// Update Statistics
router.post('/:id/statistics', async (req, res) => {
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



export default router;
