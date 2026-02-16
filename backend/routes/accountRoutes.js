const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireStaff } = require('../middleware/roleMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Account CRUD routes
router.get('/', accountController.getAllAccounts);  // Staff: all accounts, Customer: their accounts
router.get('/:id', accountController.getAccountById);  // With ownership check
router.post('/', accountController.createAccount);  // Staff: for any user, Customer: for themselves
router.put('/:id', requireStaff, accountController.updateAccount);  // Staff only
router.delete('/:id', requireStaff, accountController.deleteAccount);  // Staff only

// Banking operations (with ownership check in controller)
router.post('/:id/deposit', accountController.depositMoney);
router.post('/:id/withdraw', accountController.withdrawMoney);

module.exports = router;
