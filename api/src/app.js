import express from 'express';
import challengeRoutes from './routes/challengeRoutes.js';

const app = express();

app.use(express.json());
app.use('/api', challengeRoutes);

export default app;
