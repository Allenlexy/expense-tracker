import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Typography,
  Box,
} from '@mui/material';

interface ExpenseFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ExpenseData) => void;
  monthlyIncome: number;
  remainingBudget: number;
}

interface ExpenseData {
  amount: number;
  category: string;
  date: string;
  description: string;
  type: 'expense' | 'saving' | 'income';
  savingCategory?: string;
  operation?: 'add' | 'deduct';
}

const EXPENSE_CATEGORIES = ['rent', 'office travel', 'internet', 'food', 'purchase', 'leisure', 'home'];
const SAVING_CATEGORIES = ['SIB', 'KSFE'];

const ExpenseForm: React.FC<ExpenseFormProps> = ({ 
  open, 
  onClose, 
  onSubmit,
  monthlyIncome,
  remainingBudget
}) => {
  const [formData, setFormData] = useState<ExpenseData>({
    amount: 0,
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    type: 'expense',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'type' && value === 'saving' ? { operation: 'add' } : {}),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      amount: 0,
      category: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      type: 'expense',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          Add New {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                name="type"
                label="Type"
                value={formData.type}
                onChange={handleChange}
              >
                <MenuItem value="expense">Expense</MenuItem>
                <MenuItem value="saving">Saving</MenuItem>
                <MenuItem value="income">Monthly Income</MenuItem>
              </TextField>
            </Grid>

            {formData.type !== 'income' && (
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  name="category"
                  label="Category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {formData.type === 'expense'
                    ? EXPENSE_CATEGORIES.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))
                    : SAVING_CATEGORIES.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                </TextField>
              </Grid>
            )}

            {formData.type === 'saving' && (
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  name="operation"
                  label="Operation"
                  value={formData.operation}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="add">Add to Savings</MenuItem>
                  <MenuItem value="deduct">Withdraw from Savings</MenuItem>
                </TextField>
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="amount"
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="date"
                label="Date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>

            {formData.type !== 'income' && (
              <Grid item xs={12}>
                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Monthly Budget Status
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monthly Income: {formatCurrency(monthlyIncome)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Remaining Budget: {formatCurrency(remainingBudget)}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={
              formData.type !== 'income' && 
              formData.amount > remainingBudget &&
              (formData.type !== 'saving' || formData.operation !== 'deduct')
            }
          >
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ExpenseForm; 