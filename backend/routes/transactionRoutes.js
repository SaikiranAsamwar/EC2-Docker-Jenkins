const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Transaction routes
router.get('/', transactionController.getAllTransactions);
router.get('/account/:accountId', transactionController.getTransactionsByAccountId);

module.exports = router;
