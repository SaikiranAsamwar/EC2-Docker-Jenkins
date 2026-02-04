const db = require('../config/database');

// Get all accounts
const getAllAccounts = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM accounts ORDER BY created_at DESC');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching accounts', message: error.message });
    }
};

// Get account by ID
const getAccountById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM accounts WHERE account_id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Account not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching account', message: error.message });
    }
};

// Create new account
const createAccount = async (req, res) => {
    try {
        const { account_holder_name, email, phone, account_type, initial_balance } = req.body;
        
        // Generate account number
        const account_number = 'ACC' + Date.now();
        const balance = initial_balance || 0;

        const [result] = await db.query(
            'INSERT INTO accounts (account_number, account_holder_name, email, phone, account_type, balance) VALUES (?, ?, ?, ?, ?, ?)',
            [account_number, account_holder_name, email, phone, account_type, balance]
        );

        // Create initial transaction if there's a balance
        if (balance > 0) {
            await db.query(
                'INSERT INTO transactions (account_id, transaction_type, amount, balance_after, description) VALUES (?, ?, ?, ?, ?)',
                [result.insertId, 'Deposit', balance, balance, 'Initial deposit']
            );
        }

        res.status(201).json({
            message: 'Account created successfully',
            account_id: result.insertId,
            account_number: account_number
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({ error: 'Error creating account', message: error.message });
        }
    }
};

// Update account
const updateAccount = async (req, res) => {
    try {
        const { account_holder_name, email, phone, account_type, status } = req.body;
        const [result] = await db.query(
            'UPDATE accounts SET account_holder_name = ?, email = ?, phone = ?, account_type = ?, status = ? WHERE account_id = ?',
            [account_holder_name, email, phone, account_type, status, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Account not found' });
        }

        res.status(200).json({ message: 'Account updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating account', message: error.message });
    }
};

// Delete account
const deleteAccount = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM accounts WHERE account_id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Account not found' });
        }

        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting account', message: error.message });
    }
};

// Deposit money
const depositMoney = async (req, res) => {
    try {
        const { amount } = req.body;
        const accountId = req.params.id;

        if (amount <= 0) {
            return res.status(400).json({ error: 'Amount must be greater than 0' });
        }

        // Get current balance
        const [account] = await db.query('SELECT balance FROM accounts WHERE account_id = ?', [accountId]);
        if (account.length === 0) {
            return res.status(404).json({ error: 'Account not found' });
        }

        const newBalance = parseFloat(account[0].balance) + parseFloat(amount);

        // Update balance
        await db.query('UPDATE accounts SET balance = ? WHERE account_id = ?', [newBalance, accountId]);

        // Record transaction
        await db.query(
            'INSERT INTO transactions (account_id, transaction_type, amount, balance_after, description) VALUES (?, ?, ?, ?, ?)',
            [accountId, 'Deposit', amount, newBalance, 'Money deposited']
        );

        res.status(200).json({ message: 'Deposit successful', new_balance: newBalance });
    } catch (error) {
        res.status(500).json({ error: 'Error processing deposit', message: error.message });
    }
};

// Withdraw money
const withdrawMoney = async (req, res) => {
    try {
        const { amount } = req.body;
        const accountId = req.params.id;

        if (amount <= 0) {
            return res.status(400).json({ error: 'Amount must be greater than 0' });
        }

        // Get current balance
        const [account] = await db.query('SELECT balance FROM accounts WHERE account_id = ?', [accountId]);
        if (account.length === 0) {
            return res.status(404).json({ error: 'Account not found' });
        }

        const currentBalance = parseFloat(account[0].balance);
        if (currentBalance < amount) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        const newBalance = currentBalance - parseFloat(amount);

        // Update balance
        await db.query('UPDATE accounts SET balance = ? WHERE account_id = ?', [newBalance, accountId]);

        // Record transaction
        await db.query(
            'INSERT INTO transactions (account_id, transaction_type, amount, balance_after, description) VALUES (?, ?, ?, ?, ?)',
            [accountId, 'Withdrawal', amount, newBalance, 'Money withdrawn']
        );

        res.status(200).json({ message: 'Withdrawal successful', new_balance: newBalance });
    } catch (error) {
        res.status(500).json({ error: 'Error processing withdrawal', message: error.message });
    }
};

module.exports = {
    getAllAccounts,
    getAccountById,
    createAccount,
    updateAccount,
    deleteAccount,
    depositMoney,
    withdrawMoney
};
