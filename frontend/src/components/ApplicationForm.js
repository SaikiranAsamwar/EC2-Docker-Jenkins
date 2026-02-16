import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ApplicationForm = ({ accounts, onSubmit, onCancel }) => {
  const [applicationType, setApplicationType] = useState('account_opening');
  const [formData, setFormData] = useState({
    account_id: '',
    transaction_type: 'Deposit',
    amount: '',
    account_type: 'Savings',
    account_holder_name: '',
    email: '',
    phone: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const applicationData = {
      application_type: applicationType,
      description: formData.description
    };

    if (applicationType === 'transaction') {
      if (!formData.account_id || !formData.amount) {
        alert('Please select an account and enter amount');
        return;
      }
      applicationData.account_id = formData.account_id;
      applicationData.transaction_type = formData.transaction_type;
      applicationData.amount = Number.parseFloat(formData.amount);
    } else if (applicationType === 'account_opening') {
      if (!formData.account_holder_name || !formData.email || !formData.phone) {
        alert('Please fill in all required fields');
        return;
      }
      applicationData.account_type = formData.account_type;
      applicationData.account_holder_name = formData.account_holder_name;
      applicationData.email = formData.email;
      applicationData.phone = formData.phone;
    }

    onSubmit(applicationData);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Submit Application</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Application Type:</label>
            <select
              value={applicationType}
              onChange={(e) => {
                setApplicationType(e.target.value);
                setFormData({
                  account_id: '',
                  transaction_type: 'Deposit',
                  amount: '',
                  account_type: 'Savings',
                  account_holder_name: '',
                  email: '',
                  phone: '',
                  description: ''
                });
              }}
            >
              <option value="account_opening">Open New Account</option>
              <option value="transaction">Deposit/Withdrawal</option>
            </select>
          </div>

          {applicationType === 'account_opening' && (
            <>
              <div className="form-group">
                <label>Account Type:</label>
                <select
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

              <div className="form-group">
                <label>Account Holder Name:</label>
                <input
                  type="text"
                  name="account_holder_name"
                  value={formData.account_holder_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          {applicationType === 'transaction' && (
            <>
              <div className="form-group">
                <label>Select Account:</label>
                <select
                  name="account_id"
                  value={formData.account_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Account --</option>
                  {accounts.map((account) => (
                    <option key={account.account_id} value={account.account_id}>
                      {account.account_number} - {account.account_holder_name} (${account.balance})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Transaction Type:</label>
                <select
                  name="transaction_type"
                  value={formData.transaction_type}
                  onChange={handleChange}
                  required
                >
                  <option value="Deposit">Deposit</option>
                  <option value="Withdrawal">Withdrawal</option>
                </select>
              </div>

              <div className="form-group">
                <label>Amount:</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Description/Reason:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Provide details about this application..."
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Submit Application
            </button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ApplicationForm.propTypes = {
  accounts: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default ApplicationForm;
