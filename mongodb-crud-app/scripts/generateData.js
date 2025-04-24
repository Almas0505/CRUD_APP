// scripts/generateData.js
const mongoose = require('mongoose');
const Order = require('../models/Order');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aksultanturan7:MhIx6MVEF9XNY8xx@backendbd.litel8q.mongodb.net/Node-API?retryWrites=true&w=majority&appName=BackendBD';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected for data generation'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const generateRandomOrders = async (count) => {
  const orders = [];
  const statuses = ['pending', 'completed', 'cancelled', 'shipped'];
  
  for (let i = 1; i <= count; i++) {
    // Generate a customer ID that will create clusters of orders
    // This helps demonstrate index performance benefits
    const customer_id = Math.floor(Math.random() * 100) + 1;
    
    orders.push({
      order_id: i,
      customer_id,
      order_date: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)), // Random date within last 90 days
      amount: parseFloat((Math.random() * 500 + 10).toFixed(2)),
      status: statuses[Math.floor(Math.random() * statuses.length)]
    });
    
    // Add some specific test data with customer_id = 1234
    if (i > count - 50) {
      orders.push({
        order_id: count + i,
        customer_id: 1234, // Specific customer ID for testing
        order_date: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)),
        amount: parseFloat((Math.random() * 500 + 10).toFixed(2)),
        status: statuses[Math.floor(Math.random() * statuses.length)]
      });
    }
  }
  
  try {
    await Order.deleteMany({}); // Clear existing data
    await Order.insertMany(orders);
    console.log(`${orders.length} orders generated successfully`);
    mongoose.disconnect();
  } catch (error) {
    console.error('Error generating data:', error);
    mongoose.disconnect();
  }
};

// Generate 1000 random orders
generateRandomOrders(1000);