import express from 'express';
import router from './routes';
import { clerkMiddleware } from '@clerk/express';

const app = express();

app.use(express.json());

app.use(clerkMiddleware());

app.use('/api', router);

export default app;
