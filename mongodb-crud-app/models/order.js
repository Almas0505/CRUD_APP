// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  order_id: {
    type: Number,
    required: true,
    unique: true
  },
  customer_id: {
    type: Number,
    required: true
  },
  order_date: {
    type: Date,
    default: Date.now
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'cancelled', 'shipped']
  }
});

// We'll add indexes later during the performance optimization section

module.exports = mongoose.model('Order', orderSchema);