const db = require('../config/database');

// Get all transactions
const getAllTransactions = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT t.*, a.account_number, a.account_holder_name 
            FROM transactions t 
            JOIN accounts a ON t.account_id = a.account_id 
            ORDER BY t.transaction_date DESC
        `);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching transactions', message: error.message });
    }
};

// Get transactions by account ID
const getTransactionsByAccountId = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM transactions WHERE account_id = ? ORDER BY transaction_date DESC',
            [req.params.accountId]
        );
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching transactions', message: error.message });
    }
};

module.exports = {
    getAllTransactions,
    getTransactionsByAccountId
};
