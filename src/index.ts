import express from 'express';
import dotenv from 'dotenv';
import transactionsRouter from './routes/transactions/index';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.get('/', (req, res) => {
    res.send('Keli API is running');
});

app.use('/transactions', transactionsRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});