import mongoose from 'mongoose';

const investmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['stock', 'mutual_fund', 'fixed_deposit'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  currentValue: {
    type: Number,
  },
  interestRate: {
    type: Number,
  },
  maturityDate: {
    type: Date,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

const Investment = mongoose.model('Investment', investmentSchema);
export default Investment;
