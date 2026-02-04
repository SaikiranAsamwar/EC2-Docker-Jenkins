import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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

export default api;
