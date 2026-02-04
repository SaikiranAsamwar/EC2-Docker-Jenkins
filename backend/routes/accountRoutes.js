const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

// Account CRUD routes
router.get('/', accountController.getAllAccounts);
router.get('/:id', accountController.getAccountById);
router.post('/', accountController.createAccount);
router.put('/:id', accountController.updateAccount);
router.delete('/:id', accountController.deleteAccount);

// Banking operations
router.post('/:id/deposit', accountController.depositMoney);
router.post('/:id/withdraw', accountController.withdrawMoney);

module.exports = router;
