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

// Transactions CRUD

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

// Budgets CRUD

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

// Savings Goals CRUD

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

// Investments CRUD

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

// Loans CRUD

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

// Seed Mock Demo Data

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

// Financial Aggregation Helper
const getFinancialSummary = async (userId) => {
  const [txs, invs, loans] = await Promise.all([
    Transaction.find({ user: userId }),
    Investment.find({ user: userId }),
    Loan.find({ user: userId })
  ]);

  const income = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0) || 60000;
  const expense = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const emi = loans.reduce((s, l) => s + (l.emi || 0), 0);
  const debt = loans.reduce((s, l) => s + (l.outstanding || 0), 0);
  const investments = invs.reduce((s, i) => s + (i.amount || 0), 0);

  return {
    income,
    outflow: (expense + emi) || 30000,
    debt,
    investments
  };
};

// AI Insights API
router.get('/ai-insights', protect, async (req, res) => {
  try {
    const strategy = req.query.strategy || 'Balanced';
    const { income, outflow, debt, investments } = await getFinancialSummary(req.user._id);

    // 1. Try FastAPI microservice (with 2.5s timeout)
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const response = await fetch(`${aiServiceUrl}/api/v1/insights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ income, outflow, investments, debt, strategy }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return res.json(await response.json());
      }
    } catch {
      // Continue to built-in analytics engine
    }

    // 2. Built-in Analytics Engine
    const savings = income - outflow;
    const savings_rate = (savings / income) * 100;
    const debt_weight = (debt / (income * 12)) * 100;

    let score = 100;
    if (savings_rate < 10) score -= 25;
    else if (savings_rate < 20) score -= 15;
    else if (savings_rate < 30) score -= 5;

    if (debt_weight > 50) score -= 25;
    else if (debt_weight > 30) score -= 15;
    else if (debt_weight > 10) score -= 5;

    if (investments < income) score -= 20;
    else if (investments < income * 2) score -= 15;

    const final_score = Math.max(0, Math.min(100, score));
    const health_rating = final_score >= 75 ? "Excellent" : final_score >= 50 ? "Fair / Moderate" : "Critical Needs Improvement";

    const isGrowth = strategy === "Growth";
    const isSafety = strategy === "Safety";
    const interest_rate = isGrowth ? 14.0 : isSafety ? 7.0 : 10.0;
    const allocation_insights = isGrowth
      ? "Growth strategy: Allocate 70% in Equities/Stocks, 20% in Mutual Funds, and 10% in Fixed Deposits."
      : isSafety
      ? "Safety strategy: Prioritize FDs (70%), Debt Funds (20%), and hold minimal Equity (10%)."
      : "Balanced strategy: Keep 50% in index mutual funds, 30% in FDs, and 20% in equity shares.";

    const projected_expense = outflow * 1.02;
    const projected_savings = Math.max(0, income - projected_expense);

    return res.json({
      healthScore: final_score,
      healthRating: health_rating,
      savingsRate: parseFloat(savings_rate.toFixed(1)),
      debtAnalysis: debt > 0
        ? `You have an outstanding debt liability of ₹${debt.toLocaleString('en-IN')}. Focus on accelerating debt paydown.`
        : "Excellent! You are completely debt-free. Your cash reserves can go straight into compounding assets.",
      assetAllocation: allocation_insights,
      budgetRecommendation: `Maintain your monthly expenses below ₹${Math.round(income * 0.5).toLocaleString('en-IN')} (50% of earnings) to sustain a healthy savings rate.`,
      investmentRecommendation: `Consider investing your surplus savings of ₹${Math.max(0, Math.round(savings)).toLocaleString('en-IN')} into low-cost SIP index funds or secure FDs.`,
      projectedExpense: parseFloat(projected_expense.toFixed(2)),
      projectedSavings: parseFloat(projected_savings.toFixed(2)),
      expectedRate: interest_rate,
      initialInvested: investments
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating AI insights', error: error.message });
  }
});

// Expert Financial Knowledge Engine for AI Advisor
const generateFinancialAdvice = (prompt, { income, outflow, debt, investments }) => {
  const q = prompt.toLowerCase();

  let userIncome = income;
  let userOutflow = outflow;
  let userDebt = debt;

  // Extract explicit figures if provided in the question
  const incomeMatch = prompt.match(/(?:salary|income|earn|earning|make|take home)(?:\s+is|\s+of|\s*[:=])?\s*(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(k|lakh|lac)?/i);
  if (incomeMatch) {
    let val = parseFloat(incomeMatch[1].replace(/,/g, ''));
    const unit = (incomeMatch[2] || '').toLowerCase();
    if (unit === 'k') val *= 1000;
    if (unit === 'lakh' || unit === 'lac') val *= 100000;
    if (val > 0) userIncome = val;
  }

  const expenseMatch = prompt.match(/(?:expense|expenses|spend|spending|outflow|cost)(?:\s+is|\s+are|\s+which is|\s+whhich is|\s+of|\s*[:=])?\s*(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(k|lakh|lac)?/i);
  if (expenseMatch) {
    let val = parseFloat(expenseMatch[1].replace(/,/g, ''));
    const unit = (expenseMatch[2] || '').toLowerCase();
    if (unit === 'k') val *= 1000;
    if (unit === 'lakh' || unit === 'lac') val *= 100000;
    if (val > 0) userOutflow = val;
  }

  const debtMatch = prompt.match(/(?:debt|loan|emi|borrow)(?:\s+is|\s+of|\s*[:=])?\s*(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(k|lakh|lac)?/i);
  if (debtMatch) {
    let val = parseFloat(debtMatch[1].replace(/,/g, ''));
    const unit = (debtMatch[2] || '').toLowerCase();
    if (unit === 'k') val *= 1000;
    if (unit === 'lakh' || unit === 'lac') val *= 100000;
    if (val > 0) userDebt = val;
  }

  const surplus = Math.max(0, userIncome - userOutflow);
  const savingsRate = userIncome > 0 ? Math.round((surplus / userIncome) * 100) : 0;

  // 0. Customized plan if user specified both salary & expenses in question
  if (incomeMatch && expenseMatch) {
    const sipAmount = Math.max(500, Math.round(surplus * 0.4));
    const emergencyMonthly = Math.max(500, Math.round(surplus * 0.5));
    const flexAmount = Math.max(0, surplus - sipAmount - emergencyMonthly);
    const targetBuffer = userOutflow * 3;

    return `Personalized Financial Plan for ₹${userIncome.toLocaleString('en-IN')} Salary:

• Financial Snapshot:
  - Monthly Earnings: ₹${userIncome.toLocaleString('en-IN')}
  - Current Monthly Outflow: ₹${userOutflow.toLocaleString('en-IN')} (${Math.round((userOutflow / userIncome) * 100)}% of income)
  - Net Monthly Surplus: ₹${surplus.toLocaleString('en-IN')} (An impressive ${savingsRate}% Savings Rate!)

• Step 1: Emergency Reserve Fund (Target: ₹${targetBuffer.toLocaleString('en-IN')}):
  Save ₹${emergencyMonthly.toLocaleString('en-IN')}/month in a high-yield savings account or recurring bank deposit (RD) for ${Math.ceil(targetBuffer / emergencyMonthly)} months to build a full 3-month safety cushion.

• Step 2: Wealth-Building Equity SIP (₹${sipAmount.toLocaleString('en-IN')}/month):
  Invest ₹${sipAmount.toLocaleString('en-IN')}/month into a low-cost broad Nifty 50 Index Mutual Fund. Over 10 years at a 12% annual return, this modest monthly contribution compounds into approximately ₹${Math.round(sipAmount * 230).toLocaleString('en-IN')}!

• Step 3: Self-Investment & Upskilling (₹${flexAmount > 0 ? flexAmount.toLocaleString('en-IN') : '500'}/month):
  At ₹${userIncome.toLocaleString('en-IN')}/month, your single highest-return investment is expanding your active earning potential. Allocate ₹500/month for books, tools, or professional certifications to grow your salary to ₹25,000+.

• Pro Tip: Avoid lifestyle inflation. Keeping discretionary expenses under ₹1,000 guarantees that your ₹${surplus.toLocaleString('en-IN')} surplus steadily builds long-term wealth.`;
  }

  // 1. Budgeting / Expense Reduction / Saving
  if (q.includes("cut") || q.includes("expense") || q.includes("save") || q.includes("budget") || q.includes("frugal") || q.includes("spend")) {
    return `Smart Budgeting Strategy for Your Finances:

• Target Expense Ceiling: With your monthly earnings of ₹${userIncome.toLocaleString('en-IN')}, cap your total non-essential expenses to 30% (approx. ₹${Math.round(userIncome * 0.3).toLocaleString('en-IN')}).
• The 24-Hour Rule: Wait 24 hours before making any impulse purchase over ₹1,500. This alone eliminates 40% of non-essential monthly outflows.
• Subscription & Utility Audit: Review active memberships, streaming apps, and recurring bills. Canceling unused services can save ₹1,000–₹3,000 monthly.
• Automated Savings: Automate a transfer of your surplus (up to ₹${Math.round(surplus * 0.7).toLocaleString('en-IN')}) into an investment account on salary day before spending.`;
  }

  // 2. 50/30/20 Rule
  if (q.includes("50/30/20") || q.includes("split") || q.includes("how much to spend")) {
    return `Personalized 50/30/20 Budget Breakdown (Monthly Income: ₹${userIncome.toLocaleString('en-IN')}):

1. Needs (50% = ₹${Math.round(userIncome * 0.5).toLocaleString('en-IN')}):
   Covers essential rent, groceries, medicines, utility bills, and minimum loan commitments. Your current total monthly outflow is ₹${userOutflow.toLocaleString('en-IN')}.
2. Wants (30% = ₹${Math.round(userIncome * 0.3).toLocaleString('en-IN')}):
   Covers dining out, entertainment, shopping, gadgets, and personal leisure.
3. Savings & Investments (20% = ₹${Math.round(userIncome * 0.2).toLocaleString('en-IN')}):
   Channel this directly into high-yield mutual fund SIPs, PPF/FDs, or debt reduction.`;
  }

  // 3. Debt, Loans, EMIs & Credit Cards
  if (q.includes("debt") || q.includes("loan") || q.includes("emi") || q.includes("credit card") || q.includes("cibil") || q.includes("borrow")) {
    if (userDebt > 0) {
      return `Debt Management & Amortization Plan:

• Current Exposure: You have an outstanding liability of ₹${userDebt.toLocaleString('en-IN')}.
• Recommended Method (Debt Avalanche): Pay the minimum on all loans, but throw all extra surplus cash toward the debt with the highest interest rate (typically credit cards 36–42%, personal loans 12–16%).
• EMI-to-Income Safety Limit: Ensure your total monthly loan EMIs do not exceed 30–35% of your take-home pay.
• Prepayment Tip: Making just one extra EMI payment per year on long-term loans can shave 3 to 5 years off your repayment tenure and save lakhs in interest.`;
    }
    return `Debt Health Status:

• Congratulations! You are completely debt-free with zero outstanding liabilities.
• Recommendation: Protect this advantage by maintaining a strong credit score (750+ CIBIL) using a credit card paid in full every month.
• Wealth Acceleration: Divert what would have been loan EMIs directly into compounding equity SIPs.`;
  }

  // 4. Emergency Fund
  if (q.includes("emergency") || q.includes("buffer") || q.includes("contingency") || q.includes("liquid") || q.includes("rainy")) {
    const threeMonths = userOutflow * 3;
    const sixMonths = userOutflow * 6;
    return `Emergency Fund Blueprint:

• Recommended Reserve: For your current monthly outflow of ₹${userOutflow.toLocaleString('en-IN')}, your safety net should be between ₹${threeMonths.toLocaleString('en-IN')} (3 months) and ₹${sixMonths.toLocaleString('en-IN')} (6 months).
• Ideal Allocation Split:
  - 50% in an instant-access High-Yield Savings Account or Sweep-in Bank FD.
  - 50% in an Ultra-Short Term or Liquid Mutual Fund (yields ~6.5–7% with T+1 withdrawal).
• Golden Rule: Never invest emergency funds in volatile stocks, real estate, or lock-in instruments.`;
  }

  // 5. SIPs, Mutual Funds & Compounding
  if (q.includes("sip") || q.includes("mutual fund") || q.includes("index") || q.includes("nifty") || q.includes("compound")) {
    return `Systematic Investment Plan (SIP) Strategy:

• Power of Rupee-Cost Averaging: Monthly SIPs buy more units when markets dip and fewer when markets peak, eliminating the stress of timing the market.
• Core Allocation:
  - 50% in Nifty 50 / Sensex Broad Index Funds (low expense ratio, matches economic growth).
  - 30% in Flexi-Cap or Mid-Cap Mutual Funds (higher growth potential over 7+ years).
  - 20% in Sovereign Gold Bonds (SGB) or Fixed Income for stability.
• Step-up Advantage: Increasing your SIP by just 10% each year with your salary increment doubles your 15-year accumulated wealth.`;
  }

  // 6. Stocks & Equity Trading
  if (q.includes("stock") || q.includes("share") || q.includes("equity") || q.includes("trading") || q.includes("market") || q.includes("portfolio")) {
    return `Stock Market Investment Advisory:

• Avoid Daily Speculation: Studies show over 90% of retail intraday traders lose money. Focus on long-term fundamental investing.
• Selection Principles: Look for companies with consistent 5-year profit growth, low debt-to-equity ratio (< 0.5), and strong competitive moats (e.g., Tata, Reliance, HDFC, Infosys).
• Diversification: Never put more than 10% of your total net worth into any single stock.
• Recommended Timeline: Only invest money in individual equities that you do not need for at least 3 to 5 years.`;
  }

  // 7. Fixed Deposits (FD) vs Recurring Deposits (RD)
  if (q.includes("fd") || q.includes("fixed deposit") || q.includes("rd") || q.includes("recurring deposit") || q.includes("safe")) {
    return `Fixed Deposit & Safe Income Guidelines:

• Role in Portfolio: FDs protect capital from market downturns and provide guaranteed returns (currently 6.8%–7.5% across major Indian banks).
• FD Laddering Strategy: Instead of locking ₹3,00,000 into one 3-year FD, create three separate FDs of ₹1,00,000 for 1, 2, and 3 years. This guarantees liquidity each year without penalty.
• Tax Note: FD interest is added to your income and taxed at your slab rate. Consider debt mutual funds or arbitrage funds if you are in the 30% tax bracket.`;
  }

  // 8. Gold & Commodities
  if (q.includes("gold") || q.includes("silver") || q.includes("sgb") || q.includes("sovereign")) {
    return `Gold Investment Strategy:

• Portfolio Weight: Gold acts as an inflation hedge. Keep gold allocation between 5% and 10% of your total net worth.
• Best Instrument (SGBs): Prefer Sovereign Gold Bonds (SGB) or Gold ETFs over physical jewelry. SGBs pay 2.5% annual interest and offer 100% exemption on capital gains tax when held to maturity.
• Avoid Physical Jewelry for Investment: Making charges (10–25%) and GST (3%) immediately reduce physical gold returns.`;
  }

  // 9. Real Estate & Housing
  if (q.includes("real estate") || q.includes("property") || q.includes("house") || q.includes("home loan") || q.includes("rent vs buy")) {
    return `Real Estate & Housing Analysis:

• Rent vs. Buy Rule of Thumb: If the annual rent is less than 3–3.5% of the property purchase cost, renting and investing the surplus into equity mutual funds builds significantly higher wealth.
• Home Loan Guideline: Keep your monthly home loan EMI under 35% of your net monthly earnings.
• Down Payment Target: Save at least 20–25% as down payment to avoid severe loan burdens.`;
  }

  // 10. Tax Planning (Income Tax, 80C, Regimes)
  if (q.includes("tax") || q.includes("80c") || q.includes("80d") || q.includes("regime") || q.includes("itr") || q.includes("tds")) {
    return `Tax Optimization Roadmap:

• New vs. Old Tax Regime:
  - New Regime: Best if you earn up to ₹7–7.5 Lakhs (zero tax under rebate) or don't have large deductions (home loan, HRA).
  - Old Regime: Better if you claim HRA, ₹1.5L under 80C (ELSS, PPF, EPF), and ₹25k under 80D (Health Insurance).
• ELSS Advantage: Equity Linked Savings Schemes have the shortest lock-in (3 years) among all 80C instruments and provide higher long-term compounding.`;
  }

  // 11. Retirement & FIRE
  if (q.includes("retire") || q.includes("fire") || q.includes("pension") || q.includes("nps")) {
    return `Retirement & Financial Independence Planning:

• The Rule of 72: Divide 72 by your expected annual return to find how fast your money doubles (e.g., at 12% equity return, money doubles every 6 years).
• The 25x Target: Aim to accumulate 25 to 30 times your annual living expenses before retiring early.
• Action for Your 20s/30s: Starting a ₹5,000 monthly SIP at age 22 builds approx. ₹3.5 Crore by age 55; starting at 32 yields less than ₹1.1 Crore. Time in the market is your greatest asset.`;
  }

  // 12. Insurance (Term & Health)
  if (q.includes("insurance") || q.includes("term") || q.includes("mediclaim") || q.includes("policy") || q.includes("ulip")) {
    return `Insurance & Protection Strategy:

• Pure Term Insurance: Secure a term life insurance policy with a sum assured equal to 10–15 times your annual salary. Choose a plan up to age 60–65 only.
• Health Insurance: Do not rely solely on employer corporate insurance. Maintain an individual or family floater health cover of at least ₹10–15 Lakhs with super top-up.
• Warning on ULIPs / Endowment Plans: Avoid combining investment with insurance. Returns on traditional LIC/endowment policies rarely beat 4–5% inflation.`;
  }

  // 13. Crypto & Speculative Assets
  if (q.includes("crypto") || q.includes("bitcoin") || q.includes("speculat")) {
    return `Cryptocurrency & High-Risk Asset Advisory:

• Strict Cap: Never allocate more than 3% to 5% of your total investment portfolio to crypto or speculative digital assets.
• Volatility Warning: Crypto markets experience 50–80% drawdowns. Only invest capital you are completely prepared to lose without impacting your lifestyle.
• Tax Implications: In India, cryptocurrency gains are taxed at a flat 30% with no loss offsetting, plus 1% TDS on every transaction.`;
  }

  // 14. Salary Hike / Bonus / Windfall
  if (q.includes("salary") || q.includes("bonus") || q.includes("hike") || q.includes("increment") || q.includes("raise")) {
    return `Managing Income Growth & Bonuses:

• Avoid Lifestyle Inflation: When you receive a bonus or raise, avoid immediately upgrading cars, gadgets, or rent.
• The 50% Rule for Raises: Allocate 50% of any increment directly into expanding your monthly SIPs and loan prepayments, and enjoy the remaining 50% for improved lifestyle.
• Compounding Impact: Step up your monthly SIP contributions proportionally to accelerate your financial freedom date by years.`;
  }

  // 15. Comprehensive Fallback for Any Other Financial Query
  return `Personal Financial Consultation:

• Current Snapshot: Based on your recorded monthly income of ₹${income.toLocaleString('en-IN')} and living outflows of ₹${outflow.toLocaleString('en-IN')}, you generate a monthly surplus of ₹${surplus.toLocaleString('en-IN')}.
• Key Recommendation for "${prompt.trim()}":
  1. Priority 1: Ensure you hold 3 to 6 months of living costs in a liquid bank balance or sweep-in FD.
  2. Priority 2: Maintain on-time payments on all debt commitments (${debt > 0 ? `active debt: ₹${debt.toLocaleString('en-IN')}` : 'currently debt-free'}).
  3. Priority 3: Systematically direct your monthly surplus into diversified equity index funds (Nifty 50) and fixed deposits.
• Rule of Thumb: Focus on consistency over timing—disciplined monthly asset accumulation is the proven path to lasting wealth.`;
};

// Interactive AI Prompt API
router.post('/ai-ask', protect, async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ message: 'Please provide a valid question.' });
    }

    const { income, outflow, debt, investments } = await getFinancialSummary(req.user._id);

    // 1. Try FastAPI microservice (if running)
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const response = await fetch(`${aiServiceUrl}/api/v1/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim(), income, outflow, investments, debt }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return res.json(await response.json());
      }
    } catch {
      // Continue to built-in expert advisor
    }

    // 2. Generate comprehensive expert financial advice
    const answer = generateFinancialAdvice(prompt, { income, outflow, debt, investments });

    return res.json({ answer, timestamp: new Date() });
  } catch (error) {
    res.status(500).json({ message: 'Error generating AI answer', error: error.message });
  }
});

export default router;
