// controllers/performanceController.js
const Order = require('../models/Order');
const mongoose = require('mongoose');

// Test query performance without index
exports.testWithoutIndex = async (req, res) => {
  try {
    const { customer_id } = req.body;

    // Drop any existing index on customer_id to ensure test accuracy
    try {
      // Check if index exists before dropping
      const indexes = await Order.collection.indexes();
      const indexExists = indexes.some(index => index.name === 'customer_id_1');
      if (indexExists) {
        await Order.collection.dropIndex('customer_id_1');
      }
      // Drop composite index only if it exists
      const compositeIndexExists = indexes.some(index => index.name === 'customer_id_1_status_1');
      if (compositeIndexExists) {
        await Order.collection.dropIndex('customer_id_1_status_1');
      }
    } catch (err) {
      // Handle error gracefully
      console.error('Error dropping index:', err);
    }

    // Execute the query with explain
    const result = await Order.collection.find({ customer_id }).explain('executionStats');

    res.status(200).json({
      nReturned: result.executionStats.nReturned,
      executionTimeMillis: result.executionStats.executionTimeMillis,
      totalKeysExamined: result.executionStats.totalKeysExamined,
      totalDocsExamined: result.executionStats.totalDocsExamined
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create indexes
exports.createIndex = async (req, res) => {
  try {
    console.log('Starting index creation...');

    // Получаем существующие индексы
    const indexes = await Order.collection.indexes();
    console.log('Existing indexes:', indexes);

    // Проверяем, существуют ли индексы, которые мы хотим создать
    const customerIdIndexExists = indexes.some(index =>
      JSON.stringify(index.key) === JSON.stringify({ customer_id: 1 })
    );
    const compositeIndexExists = indexes.some(index =>
      JSON.stringify(index.key) === JSON.stringify({ customer_id: 1, status: 1 })
    );

    // Если индекс на customer_id не существует, создаем его
    if (!customerIdIndexExists) {
      await Order.collection.createIndex({ customer_id: 1 });
      console.log('Created index on customer_id');
    } else {
      console.log('Index on customer_id already exists');
    }

    // Если составной индекс на customer_id и status не существует, создаем его
    if (!compositeIndexExists) {
      await Order.collection.createIndex({ customer_id: 1, status: 1 });
      console.log('Created composite index on customer_id and status');
    } else {
      console.log('Composite index on customer_id and status already exists');
    }

    res.status(200).json({ message: 'Indexes created successfully' });
  } catch (error) {
    console.error('🔥 Error creating index:');
    console.error(error.stack); // подробный stack trace
    res.status(500).json({ error: error.message });
  }
};

// Test query performance with index
exports.testWithIndex = async (req, res) => {
  try {
    const { customer_id } = req.body;

    // Execute the query with explain
    const result = await Order.collection.find({ customer_id }).explain('executionStats');

    res.status(200).json({
      nReturned: result.executionStats.nReturned,
      executionTimeMillis: result.executionStats.executionTimeMillis,
      totalKeysExamined: result.executionStats.totalKeysExamined,
      totalDocsExamined: result.executionStats.totalDocsExamined
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
