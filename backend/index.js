import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import managementRouter from './api/management/index.js';
import teamRouter from './api/team/index.js';
import './db/index.js';

dotenv.config();

const app = express();
const port = process.env.PORT; 


app.use(cors());
app.use(express.json());
app.use('/api/management', managementRouter);
app.use('/api/team', teamRouter);

app.listen(port, () => {
    console.info(`Server running at ${port}`);
  });