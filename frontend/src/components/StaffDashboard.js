import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AccountList from './AccountList';
import AccountForm from './AccountForm';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import ApplicationsList from './ApplicationsList';
import { accountAPI, applicationAPI } from '../services/api';

const StaffDashboard = ({ currentUser, onLogout }) => {
  const [accounts, setAccounts] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalAccounts: 0,
    totalBalance: 0,
    activeAccounts: 0,
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
      const response = await applicationAPI.getAllApplications();
      setApplications(response.data);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    }
  };

  const calculateStats = () => {
    const totalBalance = accounts.reduce((sum, acc) => sum + Number.parseFloat(acc.balance || 0), 0);
    const activeAccounts = accounts.filter(acc => acc.status === 'Active').length;
    const pendingApps = applications.filter(app => app.status === 'pending').length;
    
    setStats({
      totalAccounts: accounts.length,
      totalBalance: totalBalance.toFixed(2),
      activeAccounts,
      pendingApplications: pendingApps
    });
  };

  const handleCreateAccount = async (accountData) => {
    try {
      await accountAPI.createAccount(accountData);
      fetchAccounts();
      setShowAccountForm(false);
      alert('Account created successfully!');
    } catch (err) {
      alert('Failed to create account: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleUpdateAccount = async (accountData) => {
    try {
      await accountAPI.updateAccount(selectedAccount.account_id, accountData);
      fetchAccounts();
      setShowAccountForm(false);
      setSelectedAccount(null);
      alert('Account updated successfully!');
    } catch (err) {
      alert('Failed to update account: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteAccount = async (accountId) => {
    if (globalThis.confirm('Are you sure you want to delete this account?')) {
      try {
        await accountAPI.deleteAccount(accountId);
        fetchAccounts();
        alert('Account deleted successfully!');
      } catch (err) {
        alert('Failed to delete account: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  const handleTransaction = async (type, accountId, amount) => {
    try {
      if (type === 'deposit') {
        await accountAPI.deposit(accountId, amount);
      } else {
        await accountAPI.withdraw(accountId, amount);
      }
      fetchAccounts();
      setShowTransactionForm(false);
      setSelectedAccount(null);
      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} successful!`);
    } catch (err) {
      alert(`Failed to ${type}: ` + (err.response?.data?.error || err.message));
    }
  };

  const handleEditAccount = (account) => {
    setSelectedAccount(account);
    setShowAccountForm(true);
  };

  const handleNewAccount = () => {
    setSelectedAccount(null);
    setShowAccountForm(true);
  };

  const handleShowTransaction = (account) => {
    setSelectedAccount(account);
    setShowTransactionForm(true);
  };

  const handleApproveApplication = async (applicationId) => {
    const notes = prompt('Enter review notes (optional):');
    try {
      await applicationAPI.approveApplication(applicationId, notes || '');
      alert('Application approved successfully!');
      fetchApplications();
      fetchAccounts(); // Refresh accounts as new account/transaction might be created
    } catch (err) {
      alert('Failed to approve application: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleRejectApplication = async (applicationId) => {
    const notes = prompt('Enter rejection reason:');
    if (!notes) {
      alert('Rejection reason is required');
      return;
    }
    try {
      await applicationAPI.rejectApplication(applicationId, notes);
      alert('Application rejected successfully!');
      fetchApplications();
    } catch (err) {
      alert('Failed to reject application: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="App">
      <header className="App-header staff-header">
        <div>
          <h1>🏦 Bank Management System - Staff Portal</h1>
          <p>Complete Banking Administration</p>
        </div>
        <div className="user-info">
          <span className="role-badge staff-badge">Staff</span>
          <span>Welcome, {currentUser?.full_name || currentUser?.username}!</span>
          <button className="btn btn-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="container">
        {/* Dashboard Stats */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Accounts</h3>
            <p className="stat-number">{stats.totalAccounts}</p>
          </div>
          <div className="stat-card">
            <h3>Active Accounts</h3>
            <p className="stat-number">{stats.activeAccounts}</p>
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

        {/* Pending Applications Section */}
        {applications.some(app => app.status === 'pending') && (
          <div className="applications-section-priority">
            <h2>⚠️ Pending Applications - Requires Review</h2>
            <ApplicationsList
              applications={applications.filter(app => app.status === 'pending')}
              onRefresh={fetchApplications}
              isStaff={true}
              onApprove={handleApproveApplication}
              onReject={handleRejectApplication}
            />
          </div>
        )}

        {/* All Applications Section */}
        {applications.length > 0 && (
          <div className="applications-section-all">
            <h2>All Applications</h2>
            <ApplicationsList
              applications={applications}
              onRefresh={fetchApplications}
              isStaff={true}
              onApprove={handleApproveApplication}
              onReject={handleRejectApplication}
            />
          </div>
        )}

        <div className="actions">
          <button 
            className="btn btn-primary" 
            onClick={handleNewAccount}
          >
            ➕ Create New Account
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading accounts...</div>
        ) : (
          <AccountList
            accounts={accounts}
            onEdit={handleEditAccount}
            onDelete={handleDeleteAccount}
            onTransaction={handleShowTransaction}
            isStaff={true}
          />
        )}

        {showAccountForm && (
          <AccountForm
            account={selectedAccount}
            onSubmit={selectedAccount ? handleUpdateAccount : handleCreateAccount}
            onCancel={() => {
              setShowAccountForm(false);
              setSelectedAccount(null);
            }}
          />
        )}

        {showTransactionForm && selectedAccount && (
          <TransactionForm
            account={selectedAccount}
            onSubmit={handleTransaction}
            onCancel={() => {
              setShowTransactionForm(false);
              setSelectedAccount(null);
            }}
          />
        )}

        <TransactionList />
      </div>
    </div>
  );
};

StaffDashboard.propTypes = {
  currentUser: PropTypes.shape({
    user_id: PropTypes.number,
    username: PropTypes.string,
    full_name: PropTypes.string,
    role: PropTypes.string
  }).isRequired,
  onLogout: PropTypes.func.isRequired
};

export default StaffDashboard;
