import express from 'express';
import Management from './managementModel.js';


const router = express.Router();


// Get all managers
router.get('/', async (req, res) => {
    try {
      const managements = await Management.find(); 
      res.status(200).json(managements); 
    } catch (error) {
      console.error('Error fetching management members:', error);
      res.status(500).json({ message: 'Server error' }); 
    }
  });

  export default router;