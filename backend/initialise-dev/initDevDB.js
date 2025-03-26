import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Management from '../api/user/userModel.js';
import staff from '../initialise-dev/management.js';  
import teams from '../initialise-dev/team.js'; 
import Team from '../api/team/teamModel.js';
import statistics from '../initialise-dev/statistics.js'; 
import Statistics from '../api/statistics/statisticsModel.js';
import matches from '../initialise-dev/match.js'; 
import Match from '../api/match/matchModel.js';
import players from '../initialise-dev/player.js'; 
import Player from '../api/player/playerModel.js';

async function main() {
    if (process.env.NODE_ENV !== 'development') {
        console.log('This script is only for the development environment.');
        return;
    }

    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_DB);
        
        // Drop the existing collections if needed
        await Management.collection.drop().catch(err => console.log('User collection not found'));
        await Team.collection.drop().catch(err => console.log('Team collection not found'));
        await Statistics.collection.drop().catch(err => console.log('Statistics collection not found'));

        // Insert data into the Management collection
        const managementData = await Management.create(staff);
        console.log('Database initialized');
        console.log(`${managementData.length} newManager loaded`);


        if (managementData.length >= 2) {
            // Assign management members to teams
            teams[0].managementTeam = [managementData[0]._id];  // Team A gets the first management member
            teams[1].managementTeam = [managementData[1]._id];  // Team B gets the second management member
        } else {
            console.log('Not enough management members to assign to teams.');
            await mongoose.disconnect();
            return;
        }
        
        // Insert data into the Team collection
        await Team.create(teams);
        console.log(`${teams.length} Teams loaded`);

        // Insert data into the Statistics collection
        await Statistics.create(statistics);
        console.log(`${statistics.length} statistics loaded`);

        // Insert data into the Match collection
        await Match.create(matches);
        console.log(`${matches.length} matches loaded`);

        // Insert data into the Player collection
        await Player.create(players);
        console.log(`${players.length} players loaded`);

    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        // Disconnect from MongoDB
        await mongoose.disconnect();
    }
}

main();
