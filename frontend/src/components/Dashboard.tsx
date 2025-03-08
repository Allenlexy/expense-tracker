import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Define colors for different expense categories
const COLORS = {
  rent: '#FF8042',
  'office travel': '#00C49F',
  internet: '#0088FE',
  food: '#FFBB28',
  purchase: '#FF6B6B',
  leisure: '#8884D8',
  home: '#82CA9D',
  SIB: '#4CAF50',
  KSFE: '#2196F3'
};

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

const Dashboard: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [stats, setStats] = useState<any[]>([]);
  const [bankBalances, setBankBalances] = useState({
    SIB: 0,
    KSFE: 0
  });
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [currentMonthExpenses, setCurrentMonthExpenses] = useState(0);
  const [currentMonthSavings, setCurrentMonthSavings] = useState(0);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${API_URL}/expenses`);
      setExpenses(response.data);
      calculateBankBalances(response.data);
      calculateMonthlyStats(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const calculateBankBalances = (expenseData: Expense[]) => {
    const balances = expenseData.reduce((acc, expense) => {
      if (expense.type === 'saving') {
        const amount = expense.operation === 'deduct' ? -expense.amount : expense.amount;
        acc[expense.category as keyof typeof acc] = (acc[expense.category as keyof typeof acc] || 0) + amount;
      }
      return acc;
    }, { SIB: 0, KSFE: 0 });

    setBankBalances(balances);
  };

  const calculateMonthlyStats = (expenseData: Expense[]) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const currentMonthData = expenseData.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && 
             expenseDate.getFullYear() === currentYear;
    });

    // Calculate monthly income
    const income = currentMonthData.find(expense => expense.type === 'income')?.amount || 0;
    setMonthlyIncome(income);

    // Calculate current month expenses
    const expenses = currentMonthData.reduce((total, expense) => {
      if (expense.type === 'expense') {
        return total + expense.amount;
      }
      return total;
    }, 0);
    setCurrentMonthExpenses(expenses);

    // Calculate current month savings
    const savings = currentMonthData.reduce((total, expense) => {
      if (expense.type === 'saving' && expense.operation === 'add') {
        return total + expense.amount;
      }
      return total;
    }, 0);
    setCurrentMonthSavings(savings);
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/expenses/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchStats();
  }, []);

  const handleAddExpense = async (expenseData: Omit<Expense, '_id'>) => {
    try {
      // Check if there's enough monthly income for the transaction
      if (expenseData.type !== 'income') {
        const totalSpent = currentMonthExpenses + currentMonthSavings;
        const remainingBudget = monthlyIncome - totalSpent;
        
        if (expenseData.amount > remainingBudget) {
          alert('Transaction amount exceeds remaining monthly budget!');
          return;
        }
      }

      await axios.post(`${API_URL}/expenses`, expenseData);
      fetchExpenses();
      fetchStats();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/expenses/${id}`);
      fetchExpenses();
      fetchStats();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const prepareChartData = () => {
    const categoryData = expenses.reduce((acc: any[], expense) => {
      if (expense.type === 'expense' || (expense.type === 'saving' && expense.operation === 'add')) {
        const category = expense.type === 'saving' ? `${expense.category} (Saving)` : expense.category;
        const existingCategory = acc.find(item => item.name === category);
        
        if (existingCategory) {
          existingCategory.value += expense.amount;
        } else {
          acc.push({
            name: category,
            value: expense.amount,
            type: expense.type
          });
        }
      }
      return acc;
    }, []);

    return categoryData;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const remainingBudget = monthlyIncome - (currentMonthExpenses + currentMonthSavings);
  const budgetUsagePercentage = ((currentMonthExpenses + currentMonthSavings) / monthlyIncome) * 100;

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Expense Tracker
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsFormOpen(true)}
        >
          Add Transaction
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Monthly Income
              </Typography>
              <Typography variant="h4">
                {formatCurrency(monthlyIncome)}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Budget Usage
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min(budgetUsagePercentage, 100)}
                  color={budgetUsagePercentage > 90 ? 'error' : 'primary'}
                  sx={{ height: 8, borderRadius: 5 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Remaining: {formatCurrency(remainingBudget)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                SIB Balance
              </Typography>
              <Typography variant="h4">
                {formatCurrency(bankBalances.SIB)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                KSFE Balance
              </Typography>
              <Typography variant="h4">
                {formatCurrency(bankBalances.KSFE)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Monthly Expenses
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={stats}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id.month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#8884d8" 
                  name="Total Amount"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Current Month Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={prepareChartData()}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.name} (${((entry.percent || 0) * 100).toFixed(1)}%)`}
                >
                  {prepareChartData().map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[entry.name.split(' ')[0].toLowerCase() as keyof typeof COLORS] || '#999999'}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <ExpenseList
            expenses={expenses}
            onDelete={handleDeleteExpense}
            formatCurrency={formatCurrency}
          />
        </Grid>
      </Grid>

      <ExpenseForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddExpense}
        monthlyIncome={monthlyIncome}
        remainingBudget={remainingBudget}
      />
    </Box>
  );
};

export default Dashboard; 