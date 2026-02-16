const db = require('../config/database');

// Create a new application
const createApplication = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {
            application_type,
            account_id,
            transaction_type,
            amount,
            account_type,
            account_holder_name,
            email,
            phone,
            description
        } = req.body;

        // Validate based on application type
        if (application_type === 'transaction') {
            if (!account_id || !transaction_type || !amount) {
                return res.status(400).json({ error: 'Transaction applications require account_id, transaction_type, and amount' });
            }

            // Verify account belongs to user
            const [accounts] = await db.query(
                'SELECT * FROM accounts WHERE account_id = ? AND user_id = ?',
                [account_id, userId]
            );

            if (accounts.length === 0) {
                return res.status(403).json({ error: 'Account not found or unauthorized' });
            }

            // Check if account is active
            if (accounts[0].status !== 'Active') {
                return res.status(400).json({ error: 'Cannot perform transaction on inactive account' });
            }

            // For withdrawals, check sufficient balance
            if (transaction_type === 'Withdrawal' && accounts[0].balance < amount) {
                return res.status(400).json({ error: 'Insufficient balance for withdrawal request' });
            }
        } else if (application_type === 'account_opening') {
            if (!account_type || !account_holder_name || !email || !phone) {
                return res.status(400).json({ error: 'Account opening requires account_type, account_holder_name, email, and phone' });
            }
        }

        const [result] = await db.query(
            `INSERT INTO applications 
            (user_id, application_type, account_id, transaction_type, amount, account_type, account_holder_name, email, phone, description) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, application_type, account_id, transaction_type, amount, account_type, account_holder_name, email, phone, description]
        );

        res.status(201).json({
            message: 'Application submitted successfully',
            application_id: result.insertId
        });
    } catch (error) {
        console.error('Error creating application:', error);
        res.status(500).json({ error: 'Failed to create application' });
    }
};

// Get all applications for the logged-in user
const getMyApplications = async (req, res) => {
    try {
        const userId = req.user.userId;

        const [applications] = await db.query(
            `SELECT a.*, acc.account_number, acc.account_holder_name as account_name, 
                    u.full_name as reviewed_by_name
             FROM applications a
             LEFT JOIN accounts acc ON a.account_id = acc.account_id
             LEFT JOIN users u ON a.reviewed_by = u.user_id
             WHERE a.user_id = ?
             ORDER BY a.created_at DESC`,
            [userId]
        );

        res.json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
};

// Get all applications (staff only)
const getAllApplications = async (req, res) => {
    try {
        const { status } = req.query;

        let query = `SELECT a.*, 
                            u.username, u.full_name as applicant_name, u.email as applicant_email,
                            acc.account_number, acc.account_holder_name as account_name,
                            reviewer.full_name as reviewed_by_name
                     FROM applications a
                     INNER JOIN users u ON a.user_id = u.user_id
                     LEFT JOIN accounts acc ON a.account_id = acc.account_id
                     LEFT JOIN users reviewer ON a.reviewed_by = reviewer.user_id`;

        const params = [];

        if (status) {
            query += ' WHERE a.status = ?';
            params.push(status);
        }

        query += ' ORDER BY a.created_at DESC';

        const [applications] = await db.query(query, params);
        res.json(applications);
    } catch (error) {
        console.error('Error fetching all applications:', error);
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
};

// Approve application (staff only)
const approveApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const staffId = req.user.userId;
        const { review_notes } = req.body;

        // Get application details
        const [applications] = await db.query(
            'SELECT * FROM applications WHERE application_id = ?',
            [id]
        );

        if (applications.length === 0) {
            return res.status(404).json({ error: 'Application not found' });
        }

        const application = applications[0];

        if (application.status !== 'pending') {
            return res.status(400).json({ error: 'Application already reviewed' });
        }

        // Process based on application type
        if (application.application_type === 'account_opening') {
            // Generate unique account number
            const accountNumber = 'ACC' + Date.now();

            // Create new account
            const [result] = await db.query(
                `INSERT INTO accounts (user_id, account_number, account_holder_name, email, phone, account_type, balance, status)
                 VALUES (?, ?, ?, ?, ?, ?, 0.00, 'Active')`,
                [application.user_id, accountNumber, application.account_holder_name, application.email, application.phone, application.account_type]
            );

            // Link account to application
            await db.query(
                'UPDATE applications SET account_id = ? WHERE application_id = ?',
                [result.insertId, id]
            );
        } else if (application.application_type === 'transaction') {
            // Get current account balance
            const [accounts] = await db.query(
                'SELECT * FROM accounts WHERE account_id = ?',
                [application.account_id]
            );

            if (accounts.length === 0) {
                return res.status(404).json({ error: 'Account not found' });
            }

            const account = accounts[0];
            let newBalance;

            if (application.transaction_type === 'Deposit') {
                newBalance = Number.parseFloat(account.balance) + Number.parseFloat(application.amount);
            } else if (application.transaction_type === 'Withdrawal') {
                if (Number.parseFloat(account.balance) < Number.parseFloat(application.amount)) {
                    return res.status(400).json({ error: 'Insufficient balance' });
                }
                newBalance = Number.parseFloat(account.balance) - Number.parseFloat(application.amount);
            }

            // Update account balance
            await db.query(
                'UPDATE accounts SET balance = ? WHERE account_id = ?',
                [newBalance, application.account_id]
            );

            // Record transaction
            await db.query(
                `INSERT INTO transactions (account_id, transaction_type, amount, balance_after, description)
                 VALUES (?, ?, ?, ?, ?)`,
                [application.account_id, application.transaction_type, application.amount, newBalance, application.description || 'Approved application']
            );
        }

        // Update application status
        await db.query(
            `UPDATE applications 
             SET status = 'approved', reviewed_by = ?, review_notes = ?, reviewed_at = NOW()
             WHERE application_id = ?`,
            [staffId, review_notes, id]
        );

        res.json({ message: 'Application approved successfully' });
    } catch (error) {
        console.error('Error approving application:', error);
        res.status(500).json({ error: 'Failed to approve application' });
    }
};

// Reject application (staff only)
const rejectApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const staffId = req.user.userId;
        const { review_notes } = req.body;

        // Get application details
        const [applications] = await db.query(
            'SELECT * FROM applications WHERE application_id = ?',
            [id]
        );

        if (applications.length === 0) {
            return res.status(404).json({ error: 'Application not found' });
        }

        if (applications[0].status !== 'pending') {
            return res.status(400).json({ error: 'Application already reviewed' });
        }

        // Update application status
        await db.query(
            `UPDATE applications 
             SET status = 'rejected', reviewed_by = ?, review_notes = ?, reviewed_at = NOW()
             WHERE application_id = ?`,
            [staffId, review_notes, id]
        );

        res.json({ message: 'Application rejected successfully' });
    } catch (error) {
        console.error('Error rejecting application:', error);
        res.status(500).json({ error: 'Failed to reject application' });
    }
};

module.exports = {
    createApplication,
    getMyApplications,
    getAllApplications,
    approveApplication,
    rejectApplication
};
