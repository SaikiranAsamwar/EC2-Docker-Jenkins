import axios from 'axios';

// Use relative path for API calls - nginx will proxy /api to backend
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Account APIs
export const accountAPI = {
    getAllAccounts: () => api.get('/accounts'),
    getAccountById: (id) => api.get(`/accounts/${id}`),
    createAccount: (data) => api.post('/accounts', data),
    updateAccount: (id, data) => api.put(`/accounts/${id}`, data),
    deleteAccount: (id) => api.delete(`/accounts/${id}`),
    deposit: (id, amount) => api.post(`/accounts/${id}/deposit`, { amount }),
    withdraw: (id, amount) => api.post(`/accounts/${id}/withdraw`, { amount }),
};

// Transaction APIs
export const transactionAPI = {
    getAllTransactions: () => api.get('/transactions'),
    getTransactionsByAccountId: (accountId) => api.get(`/transactions/account/${accountId}`),
};

// Auth APIs
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getProfile: (token) => api.get('/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
    }),
    updateProfile: (token, data) => api.put('/auth/profile', data, {
        headers: { Authorization: `Bearer ${token}` }
    }),
    changePassword: (token, passwords) => api.post('/auth/change-password', passwords, {
        headers: { Authorization: `Bearer ${token}` }
    }),
};

// Application APIs
export const applicationAPI = {
    createApplication: (data) => api.post('/applications', data),
    getMyApplications: () => api.get('/applications/my-applications'),
    getAllApplications: (status) => api.get('/applications', { params: { status } }),
    approveApplication: (id, review_notes) => api.put(`/applications/${id}/approve`, { review_notes }),
    rejectApplication: (id, review_notes) => api.put(`/applications/${id}/reject`, { review_notes }),
};

// Set auth token for all requests
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export default api;
