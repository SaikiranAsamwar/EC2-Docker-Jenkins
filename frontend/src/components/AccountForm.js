import React, { useState } from 'react';
import PropTypes from 'prop-types';

function AccountForm({ account, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    account_holder_name: account?.account_holder_name || '',
    email: account?.email || '',
    phone: account?.phone || '',
    account_type: account?.account_type || 'Savings',
    status: account?.status || 'Active',
    initial_balance: account ? undefined : 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.account_holder_name || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{account ? 'Edit Account' : 'Create New Account'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="account_holder_name">Account Holder Name *</label>
            <input
              type="text"
              id="account_holder_name"
              name="account_holder_name"
              value={formData.account_holder_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={!!account}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="account_type">Account Type *</label>
            <select
              id="account_type"
              name="account_type"
              value={formData.account_type}
              onChange={handleChange}
              required
            >
              <option value="Savings">Savings</option>
              <option value="Current">Current</option>
              <option value="Fixed Deposit">Fixed Deposit</option>
            </select>
          </div>

          {account && (
            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          )}

          {!account && (
            <div className="form-group">
              <label htmlFor="initial_balance">Initial Balance</label>
              <input
                type="number"
                id="initial_balance"
                name="initial_balance"
                value={formData.initial_balance}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {account ? 'Update Account' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

AccountForm.propTypes = {
  account: PropTypes.shape({
    account_id: PropTypes.number,
    account_holder_name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    account_type: PropTypes.string,
    status: PropTypes.string
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

AccountForm.defaultProps = {
  account: null
};

export default AccountForm;
