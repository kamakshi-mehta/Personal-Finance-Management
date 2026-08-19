import express from 'express';
import mongoose from 'mongoose';
import authRouter from './auth.js';
import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';
import SavingsGoal from '../models/SavingsGoal.js';
import Investment from '../models/Investment.js';
import Loan from '../models/Loan.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Mount Auth routes under /api/auth
router.use('/auth', authRouter);

// Health check endpoint
router.get('/health', async (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  let dbStatusString = 'Disconnected';
  if (dbStatus === 1) dbStatusString = 'Connected';
  else if (dbStatus === 2) dbStatusString = 'Connecting';
  else if (dbStatus === 3) dbStatusString = 'Disconnecting';

  res.json({
    status: 'ok',
    service: 'Backend Express Server',
    mongodb: dbStatusString,
    timestamp: new Date()
  });
});

// Check status of AI Microservice
router.get('/ai-status', async (req, res) => {
  const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';
  try {
    const start = Date.now();
    const response = await fetch(`${aiServiceUrl}/health`);
    const duration = Date.now() - start;
    if (response.ok) {
      const data = await response.json();
      return res.json({
        status: 'Connected',
        service: 'FastAPI AI Microservice',
        latencyMs: duration,
        response: data
      });
    } else {
      return res.json({
        status: 'Error',
        service: 'FastAPI AI Microservice',
        statusCode: response.status,
        message: 'FastAPI responded but returned an error status code'
      });
    }
  } catch (error) {
    return res.json({
      status: 'Disconnected',
      service: 'FastAPI AI Microservice',
      message: error.message
    });
  }
});

/* =========================================================================
   TRANSACTIONS CRUD
   ========================================================================= */

router.get('/transactions', protect, async (req, res) => {
  try {
    const { search, type, category, page = 1, limit = 10 } = req.query;
    const query = { user: req.user._id };

    if (search) {
      query.description = { $regex: search, $options: 'i' };
    }

    if (type && type !== 'all') {
      query.type = type.toLowerCase();
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const totalTransactions = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(totalTransactions / limitNum);

    res.json({
      transactions,
      totalPages,
      currentPage: pageNum,
      totalTransactions
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
});

router.post('/transactions', protect, async (req, res) => {
  const { description, amount, type, category, date } = req.body;
  if (!description || amount === undefined || !type || !category) {
    return res.status(400).json({ message: 'Please provide description, amount, type and category' });
  }
  try {
    const transaction = await Transaction.create({
      user: req.user._id,
      description,
      amount,
      type,
      category,
      date: date || new Date()
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Error creating transaction', error: error.message });
  }
});

router.put('/transactions/:id', protect, async (req, res) => {
  const { description, amount, type, category, date } = req.body;
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found or unauthorized' });
    }
    transaction.description = description !== undefined ? description : transaction.description;
    transaction.amount = amount !== undefined ? amount : transaction.amount;
    transaction.type = type !== undefined ? type : transaction.type;
    transaction.category = category !== undefined ? category : transaction.category;
    transaction.date = date !== undefined ? date : transaction.date;

    await transaction.save();
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Error updating transaction', error: error.message });
  }
});

router.delete('/transactions/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found or unauthorized' });
    }
    await transaction.deleteOne();
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting transaction', error: error.message });
  }
});

/* =========================================================================
   BUDGETS CRUD
   ========================================================================= */

router.get('/budgets', protect, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching budgets', error: error.message });
  }
});

router.post('/budgets', protect, async (req, res) => {
  const { name, limit, category, color } = req.body;
  if (!name || limit === undefined || !category) {
    return res.status(400).json({ message: 'Please provide name, limit and category' });
  }
  try {
    const budget = await Budget.create({
      user: req.user._id,
      name,
      limit,
      category,
      color: color || 'bg-blue-600'
    });
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Error creating budget', error: error.message });
  }
});

router.delete('/budgets/:id', protect, async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found or unauthorized' });
    }
    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting budget', error: error.message });
  }
});

/* =========================================================================
   SAVINGS GOALS CRUD
   ========================================================================= */

router.get('/savings', protect, async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ user: req.user._id });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching savings goals', error: error.message });
  }
});

router.post('/savings', protect, async (req, res) => {
  const { name, targetAmount, currentAmount, targetDate } = req.body;
  if (!name || targetAmount === undefined) {
    return res.status(400).json({ message: 'Please provide name and targetAmount' });
  }
  try {
    const goal = await SavingsGoal.create({
      user: req.user._id,
      name,
      targetAmount,
      currentAmount: currentAmount || 0,
      targetDate: targetDate ? new Date(targetDate) : undefined
    });
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Error creating savings goal', error: error.message });
  }
});

router.put('/savings/:id', protect, async (req, res) => {
  const { currentAmount } = req.body;
  if (currentAmount === undefined) {
    return res.status(400).json({ message: 'Please provide currentAmount' });
  }
  try {
    const goal = await SavingsGoal.findOne({ _id: req.params.id, user: req.user._id });
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found or unauthorized' });
    }
    goal.currentAmount = currentAmount;
    await goal.save();
    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Error updating savings goal', error: error.message });
  }
});

router.delete('/savings/:id', protect, async (req, res) => {
  try {
    const goal = await SavingsGoal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found or unauthorized' });
    }
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting savings goal', error: error.message });
  }
});

/* =========================================================================
   INVESTMENTS CRUD
   ========================================================================= */

router.get('/investments', protect, async (req, res) => {
  try {
    const query = { user: req.user._id };
    if (req.query.type) {
      query.type = req.query.type;
    }
    const investments = await Investment.find(query).sort({ date: -1 });
    res.json(investments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching investments', error: error.message });
  }
});

router.post('/investments', protect, async (req, res) => {
  const { name, type, amount, quantity, currentValue, interestRate, maturityDate } = req.body;
  if (!name || !type || amount === undefined) {
    return res.status(400).json({ message: 'Please provide name, type and amount' });
  }
  try {
    const investment = await Investment.create({
      user: req.user._id,
      name,
      type,
      amount,
      quantity: quantity || 1,
      currentValue: currentValue !== undefined ? currentValue : amount,
      interestRate,
      maturityDate: maturityDate ? new Date(maturityDate) : undefined
    });
    res.status(201).json(investment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating investment', error: error.message });
  }
});

router.delete('/investments/:id', protect, async (req, res) => {
  try {
    const investment = await Investment.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!investment) {
      return res.status(404).json({ message: 'Investment not found or unauthorized' });
    }
    res.json({ message: 'Investment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting investment', error: error.message });
  }
});

/* =========================================================================
   LOANS CRUD
   ========================================================================= */

router.get('/loans', protect, async (req, res) => {
  try {
    const loans = await Loan.find({ user: req.user._id });
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching loans', error: error.message });
  }
});

router.post('/loans', protect, async (req, res) => {
  const { name, totalAmount, outstanding, emi, rate, nextEmi } = req.body;
  if (!name || totalAmount === undefined || outstanding === undefined || emi === undefined || !rate) {
    return res.status(400).json({ message: 'Please provide name, totalAmount, outstanding, emi and rate' });
  }
  try {
    const loan = await Loan.create({
      user: req.user._id,
      name,
      totalAmount,
      outstanding,
      emi,
      rate,
      nextEmi: nextEmi ? new Date(nextEmi) : undefined
    });
    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({ message: 'Error creating loan', error: error.message });
  }
});

router.delete('/loans/:id', protect, async (req, res) => {
  try {
    const loan = await Loan.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found or unauthorized' });
    }
    res.json({ message: 'Loan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting loan', error: error.message });
  }
});

/* =========================================================================
   SEED DEMO DATA
   ========================================================================= */

router.post('/seed', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Clear existing user data in planning collections
    await Promise.all([
      Transaction.deleteMany({ user: userId }),
      Budget.deleteMany({ user: userId }),
      SavingsGoal.deleteMany({ user: userId }),
      Investment.deleteMany({ user: userId }),
      Loan.deleteMany({ user: userId })
    ]);

    // 1. Seed Income & Expenses
    const startOfThisMonth = new Date();
    startOfThisMonth.setDate(1);
    
    const transactionsData = [
      { user: userId, description: 'Monthly Salary Credit', amount: 60000, type: 'income', category: 'Salary', date: new Date() },
      { user: userId, description: 'House Rent', amount: 15000, type: 'expense', category: 'Rent', date: new Date(new Date().setDate(2)) },
      { user: userId, description: 'Monthly Grocery & Milk', amount: 12000, type: 'expense', category: 'Food', date: new Date(new Date().setDate(5)) },
      { user: userId, description: 'Electricity & Gas Utility', amount: 4500, type: 'expense', category: 'Utilities', date: new Date(new Date().setDate(8)) },
      { user: userId, description: 'Children School Tuition Fees', amount: 5000, type: 'expense', category: 'Education', date: new Date(new Date().setDate(10)) },
      { user: userId, description: 'Petrol & Public Transit', amount: 3500, type: 'expense', category: 'Transportation', date: new Date(new Date().setDate(12)) },
      { user: userId, description: 'Family Health Check & Medicines', amount: 2000, type: 'expense', category: 'Medical', date: new Date(new Date().setDate(15)) }
    ];
    await Transaction.insertMany(transactionsData);

    // 2. Seed Budgets
    const budgetsData = [
      { user: userId, name: 'Food & Groceries Limit', limit: 12000, category: 'Food', color: 'bg-blue-600' },
      { user: userId, name: 'Utilities Limit', limit: 5000, category: 'Utilities', color: 'bg-indigo-600' },
      { user: userId, name: 'Transit Limit', limit: 4000, category: 'Transportation', color: 'bg-sky-500' }
    ];
    await Budget.insertMany(budgetsData);

    // 3. Seed Savings Goals
    const savingsData = [
      { user: userId, name: 'Emergency Fund', targetAmount: 150000, currentAmount: 45000, targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) },
      { user: userId, name: 'Children College Saving', targetAmount: 300000, currentAmount: 60000, targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }
    ];
    await SavingsGoal.insertMany(savingsData);

    // 4. Seed Investments
    const investmentsData = [
      { user: userId, name: 'ELSS Tax Saver Fund SIP', type: 'mutual_fund', amount: 3000, interestRate: 15.2, date: new Date() },
      { user: userId, name: 'State Bank of India FD', type: 'fixed_deposit', amount: 50000, interestRate: 6.8, maturityDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
      { user: userId, name: 'TATA MOTORS', type: 'stock', amount: 950, quantity: 15, currentValue: 980 }
    ];
    await Investment.insertMany(investmentsData);

    // 5. Seed Loans
    await Loan.create({
      user: userId,
      name: 'Two Wheeler Loan EMI',
      totalAmount: 80000,
      outstanding: 35000,
      emi: 2500,
      rate: '10.50%'
    });

    res.json({ message: 'Middle-class family sample financial figures seeded successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error seeding demo data', error: error.message });
  }
});

/* =========================================================================
   AI INSIGHTS ENDPOINT
   ========================================================================= */

router.get('/ai-insights', protect, async (req, res) => {
  try {
    const strategy = req.query.strategy || 'Balanced';
    const userId = req.user._id;

    // 1. Load user records from MongoDB
    const [txs, invs, loans] = await Promise.all([
      Transaction.find({ user: userId }),
      Investment.find({ user: userId }),
      Loan.find({ user: userId })
    ]);

    // 2. Aggregate metrics
    const totalIncome = txs
      .filter(t => t.type === 'income')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const totalExpense = txs
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const totalSip = invs.filter(i => i.type === 'mutual_fund').reduce((acc, curr) => acc + curr.amount, 0);
    const totalStocks = invs.filter(i => i.type === 'stock').reduce((acc, curr) => acc + (curr.quantity * (curr.currentValue || curr.amount)), 0);
    const totalFds = invs.filter(i => i.type === 'fixed_deposit').reduce((acc, curr) => acc + curr.amount, 0);

    const totalInvestments = totalSip + totalStocks + totalFds;
    const totalDebt = loans.reduce((acc, curr) => acc + curr.outstanding, 0);
    const totalEmi = loans.reduce((acc, curr) => acc + curr.emi, 0);

    // Total monthly outflows include expenses + EMIs
    const monthlyOutflow = totalExpense + totalEmi;

    // 3. Make POST request to FastAPI AI service
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';
    const response = await fetch(`${aiServiceUrl}/api/v1/insights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        income: totalIncome || 60000, // seed fallback if new user
        outflow: monthlyOutflow || 30000,
        investments: totalInvestments || 0,
        debt: totalDebt || 0,
        strategy: strategy
      })
    });

    if (!response.ok) {
      throw new Error('AI Service responded with an error');
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error contacting AI Service:', error.message);
    res.status(500).json({ message: 'Error generating AI insights', error: error.message });
  }
});

export default router;
