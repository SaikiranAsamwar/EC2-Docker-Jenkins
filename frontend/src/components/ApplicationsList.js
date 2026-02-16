import React from 'react';
import PropTypes from 'prop-types';

const ApplicationsList = ({ applications, onRefresh, isStaff, onApprove, onReject }) => {
  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      approved: 'status-approved',
      rejected: 'status-rejected'
    };
    
    return <span className={`application-status ${statusClasses[status]}`}>{status.toUpperCase()}</span>;
  };

  const formatApplicationType = (type) => {
    const types = {
      account_opening: 'Account Opening',
      transaction: 'Transaction',
      account_closure: 'Account Closure'
    };
    return types[type] || type;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (applications.length === 0) {
    return (
      <div className="empty-state">
        <h3>No Applications</h3>
        <p>You haven't submitted any applications yet.</p>
      </div>
    );
  }

  return (
    <div className="applications-section">
      <div className="section-header">
        <h2>My Applications</h2>
        <button className="btn btn-secondary" onClick={onRefresh}>
          🔄 Refresh
        </button>
      </div>

      <div className="applications-list">
        {applications.map((app) => (
          <div key={app.application_id} className="application-card">
            <div className="application-header">
              <div>
                <strong>Application #{app.application_id}</strong>
                {' - '}
                <span>{formatApplicationType(app.application_type)}</span>
              </div>
              {getStatusBadge(app.status)}
            </div>

            <div className="application-details">
              {app.application_type === 'transaction' && (
                <>
                  <p><strong>Account:</strong> {app.account_number} - {app.account_name}</p>
                  <p><strong>Type:</strong> {app.transaction_type}</p>
                  <p><strong>Amount:</strong> ${Number.parseFloat(app.amount || 0).toFixed(2)}</p>
                </>
              )}

              {app.application_type === 'account_opening' && (
                <>
                  <p><strong>Account Type:</strong> {app.account_type}</p>
                  <p><strong>Account Holder:</strong> {app.account_holder_name}</p>
                  <p><strong>Email:</strong> {app.email}</p>
                  <p><strong>Phone:</strong> {app.phone}</p>
                  {app.status === 'approved' && app.account_number && (
                    <p><strong>Account Number:</strong> {app.account_number}</p>
                  )}
                </>
              )}

              {app.description && (
                <p><strong>Description:</strong> {app.description}</p>
              )}

              <p className="application-date">
                <strong>Submitted:</strong> {formatDate(app.created_at)}
              </p>

              {app.status !== 'pending' && (
                <>
                  <p><strong>Reviewed by:</strong> {app.reviewed_by_name || 'Staff'}</p>
                  {app.reviewed_at && (
                    <p><strong>Reviewed at:</strong> {formatDate(app.reviewed_at)}</p>
                  )}
                  {app.review_notes && (
                    <p><strong>Review Notes:</strong> {app.review_notes}</p>
                  )}
                </>
              )}
            </div>

            {isStaff && app.status === 'pending' && (
              <div className="application-actions">
                <button
                  className="btn btn-success"
                  onClick={() => onApprove(app.application_id)}
                >
                  ✓ Approve
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => onReject(app.application_id)}
                >
                  ✗ Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

ApplicationsList.propTypes = {
  applications: PropTypes.array.isRequired,
  onRefresh: PropTypes.func.isRequired,
  isStaff: PropTypes.bool,
  onApprove: PropTypes.func,
  onReject: PropTypes.func
};

ApplicationsList.defaultProps = {
  isStaff: false,
  onApprove: () => {},
  onReject: () => {}
};

export default ApplicationsList;
