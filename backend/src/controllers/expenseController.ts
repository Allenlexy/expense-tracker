import { Request, Response } from 'express';
import Expense from '../models/Expense';

// Get all expenses for the last 6 months
export const getExpenses = async (req: Request, res: Response): Promise<void> => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const expenses = await Expense.find({
      date: { $gte: sixMonthsAgo }
    }).sort({ date: -1 });
    
    res.json(expenses);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Add new expense
export const addExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const expense = new Expense(req.body);
    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Update expense
export const updateExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!updatedExpense) {
      res.status(404).json({ message: 'Expense not found' });
      return;
    }
    res.json(updatedExpense);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Delete expense
export const deleteExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedExpense = await Expense.findByIdAndDelete(id);
    if (!deletedExpense) {
      res.status(404).json({ message: 'Expense not found' });
      return;
    }
    res.json({ message: 'Expense deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get expense statistics
export const getExpenseStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const stats = await Expense.aggregate([
      {
        $match: {
          date: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            type: '$type',
            category: '$category',
            month: { $month: '$date' },
            year: { $year: '$date' }
          },
          total: { $sum: '$amount' }
        }
      }
    ]);

    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}; 