import express from 'express';
import { Router } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import { getExpenses, addExpense, updateExpense, deleteExpense, getExpenseStats } from './controllers/expenseController';

dotenv.config();

const app = express();
const router = Router();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://expense-tracker-frontend-your-url.vercel.app'] 
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
router.get('/expenses', getExpenses);
router.post('/expenses', addExpense);
router.put('/expenses/:id', updateExpense);
router.delete('/expenses/:id', deleteExpense);
router.get('/expenses/stats', getExpenseStats);

app.use('/api', router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 