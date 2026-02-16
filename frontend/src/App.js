import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import AccountList from './components/AccountList';
import AccountForm from './components/AccountForm';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import { accountAPI, authAPI, setAuthToken } from './services/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setAuthToken(token);
      setCurrentUser(JSON.parse(user));
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAccounts();
    }
  }, [isAuthenticated]);

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

  const handleLogin = async (credentials) => {
    const response = await authAPI.login(credentials);
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuthToken(token);
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleRegister = async (userData) => {
    const response = await authAPI.register(userData);
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuthToken(token);
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
    setAccounts([]);
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

  // If not authenticated, show login or register page
  if (!isAuthenticated) {
    return showRegister ? (
      <Register
        onRegister={handleRegister}
        onSwitchToLogin={() => setShowRegister(false)}
      />
    ) : (
      <Login
        onLogin={handleLogin}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  // Authenticated user view
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h1>🏦 Bank Management System</h1>
          <p>Complete Banking Solution</p>
        </div>
        <div className="user-info">
          <span>Welcome, {currentUser?.full_name || currentUser?.username}!</span>
          <button className="btn btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="container">
        {error && <div className="error-message">{error}</div>}

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
}

export default App;
