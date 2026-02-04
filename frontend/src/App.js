import React, { useState, useEffect } from 'react';
import './App.css';
import AccountList from './components/AccountList';
import AccountForm from './components/AccountForm';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import { accountAPI } from './services/api';

function App() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

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

  return (
    <div className="App">
      <header className="App-header">
        <h1>🏦 Bank Management System</h1>
        <p>Complete Banking Solution</p>
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
