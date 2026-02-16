import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AccountList from './AccountList';
import ApplicationForm from './ApplicationForm';
import ApplicationsList from './ApplicationsList';
import TransactionList from './TransactionList';
import { accountAPI, applicationAPI } from '../services/api';

const CustomerDashboard = ({ currentUser, onLogout }) => {
  const [accounts, setAccounts] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalAccounts: 0,
    totalBalance: 0,
    pendingApplications: 0
  });

  useEffect(() => {
    fetchAccounts();
    fetchApplications();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [accounts, applications]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await accountAPI.getAllAccounts();
      setAccounts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch accounts. Please check if the backend server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await applicationAPI.getMyApplications();
      setApplications(response.data);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    }
  };

  const calculateStats = () => {
    const totalBalance = accounts.reduce((sum, acc) => sum + Number.parseFloat(acc.balance || 0), 0);
    const pendingApps = applications.filter(app => app.status === 'pending').length;
    
    setStats({
      totalAccounts: accounts.length,
      totalBalance: totalBalance.toFixed(2),
      pendingApplications: pendingApps
    });
  };

  const handleSubmitApplication = async (applicationData) => {
    try {
      await applicationAPI.createApplication(applicationData);
      setShowApplicationForm(false);
      fetchApplications();
      fetchAccounts(); // Refresh accounts in case application was immediately approved
      alert('Application submitted successfully! Staff will review it soon.');
    } catch (err) {
      alert('Failed to submit application: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="App">
      <header className="App-header customer-header">
        <div>
          <h1>🏦 Bank Management System - Customer Portal</h1>
          <p>Your Personal Banking Dashboard</p>
        </div>
        <div className="user-info">
          <span className="role-badge customer-badge">Customer</span>
          <span>Welcome, {currentUser?.full_name || currentUser?.username}!</span>
          <button className="btn btn-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="container">
        {/* Customer Stats */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>My Accounts</h3>
            <p className="stat-number">{stats.totalAccounts}</p>
          </div>
          <div className="stat-card">
            <h3>Total Balance</h3>
            <p className="stat-number">${stats.totalBalance}</p>
          </div>
          <div className="stat-card">
            <h3>Pending Applications</h3>
            <p className="stat-number">{stats.pendingApplications}</p>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="actions">
          <button 
            className="btn btn-primary" 
            onClick={() => setShowApplicationForm(true)}
          >
            📝 Submit Application
          </button>
        </div>

        {/* Applications Section */}
        {applications.length > 0 && (
          <ApplicationsList
            applications={applications}
            onRefresh={fetchApplications}
            isStaff={false}
          />
        )}

        {/* Accounts Section */}
        <h2>My Accounts</h2>
        {loading ? (
          <div className="loading">Loading your accounts...</div>
        ) : accounts.length === 0 ? (
          <div className="empty-state">
            <h3>No Accounts Found</h3>
            <p>You don't have any bank accounts yet. Submit an application to open a new account!</p>
          </div>
        ) : (
          <AccountList
            accounts={accounts}
            onEdit={null}  // Customers cannot edit account details
            onDelete={null}  // Customers cannot delete accounts
            onTransaction={null}  // Customers must apply for transactions
            isStaff={false}
          />
        )}

        {showApplicationForm && (
          <ApplicationForm
            accounts={accounts}
            onSubmit={handleSubmitApplication}
            onCancel={() => setShowApplicationForm(false)}
          />
        )}

        <TransactionList />
      </div>
    </div>
  );
};

CustomerDashboard.propTypes = {
  currentUser: PropTypes.shape({
    user_id: PropTypes.number,
    username: PropTypes.string,
    full_name: PropTypes.string,
    role: PropTypes.string
  }).isRequired,
  onLogout: PropTypes.func.isRequired
};

export default CustomerDashboard;
