const mongooseInExpenses = require('mongoose');

const expensesSchema = new mongooseInExpenses.Schema({
  name: {
    required: true,
    type: String,
  },
  value: {
    required: true,
    type: Number,
  },
  date: {
    required: true,
    type: Date,
  },
  description: {
    required: true,
    type: String,
  },
  category: {
    required: true,
    type: mongooseInExpenses.Schema.Types.ObjectId,
    ref: 'Categories',
  }
}, { versionKey: false })

module.exports = mongooseInExpenses.model('Expenses', expensesSchema);
