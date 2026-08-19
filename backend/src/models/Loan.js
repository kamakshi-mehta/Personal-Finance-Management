import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  outstanding: {
    type: Number,
    required: true,
  },
  emi: {
    type: Number,
    required: true,
  },
  rate: {
    type: String,
    required: true,
  },
  nextEmi: {
    type: Date,
    default: Date.now,
  }
});

const Loan = mongoose.model('Loan', loanSchema);
export default Loan;
