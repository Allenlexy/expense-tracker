# Expense Tracker

A full-stack expense tracking application built with React, TypeScript, Node.js, and MongoDB.

## Features

- Monthly income and expense tracking
- Cumulative savings tracking for multiple bank accounts (SIB, KSFE)
- Budget management with visual progress indicators
- Interactive charts and statistics
- Transaction history with filtering capabilities
- Color-coded transaction types
- Responsive modern UI

## Tech Stack

### Frontend

- React with TypeScript
- Material-UI for components
- Recharts for data visualization
- Axios for API calls
- Moment.js for date handling

### Backend

- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- CORS for cross-origin requests

## Setup

1. Clone the repository:

```bash
git clone [repository-url]
cd expense-tracker
```

2. Install dependencies:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
   Create a `.env` file in the backend directory with:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/expense-tracker
```

4. Start the application:

```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm start
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Usage

1. First, add your monthly income
2. Add expenses and savings as needed
3. Monitor your budget usage with the progress bar
4. Track your cumulative savings in the bank balance cards
5. Use filters to analyze your transactions

## Features in Detail

### Transaction Types

- **Expenses**: Regular monthly expenses (rent, food, etc.)
- **Savings**: Bank deposits and withdrawals
- **Income**: Monthly income tracking

### Categories

- **Expenses**: Rent, Office Travel, Internet, Food, Purchase, Leisure, Home
- **Savings**: SIB, KSFE

### Visualizations

- Pie chart for expense distribution
- Line chart for monthly trends
- Progress bar for budget tracking
- Color-coded transaction list
