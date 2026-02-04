import React, { useState, useEffect } from 'react';
import { transactionAPI } from '../services/api';

function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionAPI.getAllTransactions();
      setTransactions(response.data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="transactions-section">
        <h2>Recent Transactions</h2>
        <p>Loading transactions...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="transactions-section">
        <h2>Recent Transactions</h2>
        <p>No transactions found.</p>
      </div>
    );
  }

  return (
    <div className="transactions-section">
      <h2>Recent Transactions</h2>
      <div className="transaction-list">
        {transactions.slice(0, 10).map((transaction) => (
          <div key={transaction.transaction_id} className="transaction-item">
            <div className="transaction-info">
              <div className={`transaction-type ${transaction.transaction_type.toLowerCase()}`}>
                {transaction.transaction_type === 'Deposit' && '💰'}
                {transaction.transaction_type === 'Withdrawal' && '💸'}
                {transaction.transaction_type === 'Transfer' && '🔄'}
                {' '}
                {transaction.transaction_type}
              </div>
              <div className="transaction-details">
                <div><strong>Account:</strong> {transaction.account_number}</div>
                <div><strong>Holder:</strong> {transaction.account_holder_name}</div>
                <div><strong>Date:</strong> {formatDate(transaction.transaction_date)}</div>
                {transaction.description && <div><strong>Note:</strong> {transaction.description}</div>}
              </div>
            </div>
            <div className="transaction-amount">
              <div className={transaction.transaction_type === 'Deposit' ? 'amount-positive' : 'amount-negative'}>
                {transaction.transaction_type === 'Deposit' ? '+' : '-'}₹{Number.parseFloat(transaction.amount).toFixed(2)}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
                Balance: ₹{Number.parseFloat(transaction.balance_after).toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransactionList;
