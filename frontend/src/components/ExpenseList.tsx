import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  TextField,
  MenuItem,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment';

interface Expense {
  _id: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  type: 'expense' | 'saving' | 'income';
  savingCategory?: string;
  operation?: 'add' | 'deduct';
}

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  formatCurrency: (amount: number) => string;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete, formatCurrency }) => {
  const [filter, setFilter] = useState({
    type: 'all',
    category: 'all',
  });

  const filteredExpenses = expenses.filter((expense) => {
    if (filter.type !== 'all' && expense.type !== filter.type) return false;
    if (filter.category !== 'all' && expense.category !== filter.category) return false;
    return true;
  });

  const categories = Array.from(new Set(expenses.map((expense) => expense.category)));

  const getRowColor = (expense: Expense) => {
    switch (expense.type) {
      case 'income':
        return 'rgba(76, 175, 80, 0.1)';
      case 'saving':
        return expense.operation === 'add' 
          ? 'rgba(33, 150, 243, 0.1)' 
          : 'rgba(255, 152, 0, 0.1)';
      default:
        return 'inherit';
    }
  };

  const getAmountColor = (expense: Expense) => {
    if (expense.type === 'income' || (expense.type === 'saving' && expense.operation === 'add')) {
      return 'success.main';
    }
    return 'error.main';
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Transactions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            select
            label="Type"
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
            <MenuItem value="saving">Saving</MenuItem>
            <MenuItem value="income">Income</MenuItem>
          </TextField>
          <TextField
            select
            label="Category"
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="all">All</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Operation</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredExpenses.map((expense) => (
              <TableRow 
                key={expense._id}
                sx={{
                  bgcolor: getRowColor(expense)
                }}
              >
                <TableCell>{moment(expense.date).format('MMM DD, YYYY')}</TableCell>
                <TableCell>{expense.type}</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell 
                  align="right"
                  sx={{ color: getAmountColor(expense) }}
                >
                  {formatCurrency(expense.amount)}
                </TableCell>
                <TableCell>
                  {expense.type === 'saving' ? expense.operation : '-'}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="error"
                    onClick={() => onDelete(expense._id)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredExpenses.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No transactions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ExpenseList; 