import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  limit: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: 'bg-blue-600',
  }
});

const Budget = mongoose.model('Budget', budgetSchema);
export default Budget;
