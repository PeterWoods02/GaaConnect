import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import managementRouter from './api/management/index.js';
import teamRouter from './api/team/index.js';
import statisticsRouter from './api/statistics/index.js';
import matchRouter from './api/match/index.js';
import playerRouter from './api/player/index.js';
import './db/index.js';

dotenv.config();

const app = express();
const port = process.env.PORT; 


app.use(cors());
app.use(express.json());
app.use('/api/management', managementRouter);
app.use('/api/team', teamRouter);
app.use('/api/statistics', statisticsRouter);
app.use('/api/match', matchRouter);
app.use('/api/player', playerRouter);

app.listen(port, () => {
    console.info(`Server running at ${port}`);
  });