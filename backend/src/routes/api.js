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
  const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
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

export default router;
