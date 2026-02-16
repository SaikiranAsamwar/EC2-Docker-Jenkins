const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRATION = '24h';

// Register new user
const register = async (req, res) => {
    const { username, email, password, full_name, role } = req.body;

    try {
        // Validate input
        if (!username || !email || !password || !full_name) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Validate role
        const userRole = role && (role === 'staff' || role === 'customer') ? role : 'customer';

        // Check if user already exists
        const [existingUsers] = await db.execute(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({ error: 'Username or email already exists' });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert user into database
        const [result] = await db.execute(
            'INSERT INTO users (username, email, password, full_name, role) VALUES (?, ?, ?, ?, ?)',
            [username, email, hashedPassword, full_name, userRole]
        );

        // Generate JWT token
        const token = jwt.sign(
            { user_id: result.insertId, username, email, role: userRole },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                user_id: result.insertId,
                username,
                email,
                full_name,
                role: userRole
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Failed to register user', message: error.message });
    }
};

// Login user
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Validate input
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Find user by username or email
        const [users] = await db.execute(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, username]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { user_id: user.user_id, username: user.username, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                full_name: user.full_name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to login', message: error.message });
    }
};

// Get current user profile
const getProfile = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const [users] = await db.execute(
            'SELECT user_id, username, email, full_name, role, created_at FROM users WHERE user_id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(users[0]);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to get profile', message: error.message });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    const { full_name, email } = req.body;
    const userId = req.user.user_id;

    try {
        // Check if email is already taken by another user
        if (email) {
            const [existingUsers] = await db.execute(
                'SELECT * FROM users WHERE email = ? AND user_id != ?',
                [email, userId]
            );

            if (existingUsers.length > 0) {
                return res.status(409).json({ error: 'Email already in use' });
            }
        }

        // Update user profile
        await db.execute(
            'UPDATE users SET full_name = COALESCE(?, full_name), email = COALESCE(?, email) WHERE user_id = ?',
            [full_name, email, userId]
        );

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile', message: error.message });
    }
};

// Change password
const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.user_id;

    try {
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current and new password are required' });
        }

        // Get current user
        const [users] = await db.execute('SELECT * FROM users WHERE user_id = ?', [userId]);

        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = users[0];

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update password
        await db.execute('UPDATE users SET password = ? WHERE user_id = ?', [hashedPassword, userId]);

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Failed to change password', message: error.message });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword
};
