import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Management from '../api/management/managementModel.js';
import staff from '../initialise-dev/management.js';  

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

        // Insert data into the Management collection
        await Management.create(staff);
        console.log('Database initialized');
        console.log(`${staff.length} newManager loaded`);
        

    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        // Disconnect from MongoDB
        await mongoose.disconnect();
    }
}

main();
