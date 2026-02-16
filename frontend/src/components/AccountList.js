import React from 'react';
import PropTypes from 'prop-types';

function AccountList({ accounts, onEdit, onDelete, onTransaction, isStaff }) {
  if (accounts.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'white' }}>
        <p>No accounts found. Create your first account to get started!</p>
      </div>
    );
  }

  return (
    <div className="accounts-list">
      {accounts.map((account) => (
        <div key={account.account_id} className="account-card">
          <div className="account-header">
            <div className="account-number">
              {account.account_number}
            </div>
            <div className={`account-status status-${account.status.toLowerCase()}`}>
              {account.status}
            </div>
          </div>

          <div className="account-info">
            <div className="info-row">
              <span className="info-label">Account Holder:</span>
              <span className="info-value">{account.account_holder_name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{account.email}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Phone:</span>
              <span className="info-value">{account.phone || 'N/A'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Account Type:</span>
              <span className="info-value">{account.account_type}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Balance:</span>
              <span className="balance">₹{Number.parseFloat(account.balance).toFixed(2)}</span>
            </div>
          </div>

          <div className="account-actions">
            <button 
              className="btn btn-success" 
              onClick={() => onTransaction(account)}
            >
              💰 Transaction
            </button>
            {isStaff && onEdit && (
              <button 
                className="btn btn-info" 
                onClick={() => onEdit(account)}
              >
                ✏️ Edit
              </button>
            )}
            {isStaff && onDelete && (
              <button 
                className="btn btn-danger" 
                onClick={() => onDelete(account.account_id)}
              >
                🗑️ Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

AccountList.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.shape({
    account_id: PropTypes.number,
    account_number: PropTypes.string,
    account_holder_name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    account_type: PropTypes.string,
    balance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    status: PropTypes.string
  })).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onTransaction: PropTypes.func.isRequired,
  isStaff: PropTypes.bool
};

export default AccountList;
