// Middleware to check if user has staff role
const requireStaff = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (req.user.role !== 'staff') {
            return res.status(403).json({ error: 'Access denied. Staff privileges required.' });
        }

        next();
    } catch (error) {
        return res.status(500).json({ error: 'Authorization failed', message: error.message });
    }
};

// Middleware to check if user has customer role
const requireCustomer = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (req.user.role !== 'customer') {
            return res.status(403).json({ error: 'Access denied. Customer privileges required.' });
        }

        next();
    } catch (error) {
        return res.status(500).json({ error: 'Authorization failed', message: error.message });
    }
};

// Middleware to check if user is either staff or customer
const requireAuthenticated = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        next();
    } catch (error) {
        return res.status(500).json({ error: 'Authorization failed', message: error.message });
    }
};

module.exports = {
    requireStaff,
    requireCustomer,
    requireAuthenticated
};
