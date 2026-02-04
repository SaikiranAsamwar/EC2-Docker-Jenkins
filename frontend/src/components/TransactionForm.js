import React, { useState } from 'react';
import PropTypes from 'prop-types';

function TransactionForm({ account, onSubmit, onCancel }) {
  const [transactionType, setTransactionType] = useState('deposit');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = Number.parseFloat(amount);
    
    if (numAmount <= 0) {
      alert('Amount must be greater than 0');
      return;
    }

    if (transactionType === 'withdraw' && numAmount > account.balance) {
      alert('Insufficient balance');
      return;
    }

    onSubmit(transactionType, account.account_id, numAmount);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Make a Transaction</h2>
        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
          <p><strong>Account:</strong> {account.account_number}</p>
          <p><strong>Holder:</strong> {account.account_holder_name}</p>
          <p><strong>Current Balance:</strong> <span style={{ color: '#28a745', fontWeight: 'bold' }}>₹{Number.parseFloat(account.balance).toFixed(2)}</span></p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="transactionType">Transaction Type</label>
            <select
              id="transactionType"
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              required
            >
              <option value="deposit">Deposit</option>
              <option value="withdraw">Withdraw</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount *</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.01"
              step="0.01"
              required
              placeholder="Enter amount"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className={`btn ${transactionType === 'deposit' ? 'btn-success' : 'btn-warning'}`}>
              {transactionType === 'deposit' ? '💰 Deposit' : '💸 Withdraw'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

TransactionForm.propTypes = {
  account: PropTypes.shape({
    account_id: PropTypes.number.isRequired,
    account_number: PropTypes.string.isRequired,
    account_holder_name: PropTypes.string.isRequired,
    balance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default TransactionForm;
