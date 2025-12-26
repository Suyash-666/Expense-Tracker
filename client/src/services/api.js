import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let authToken = localStorage.getItem('token') || null;

const api = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: false,
});

api.interceptors.request.use((config) => {
	if (authToken) {
		config.headers.Authorization = `Bearer ${authToken}`;
	}
	return config;
});

export const setAuthToken = (token) => {
	authToken = token;
	if (token) {
		localStorage.setItem('token', token);
	} else {
		localStorage.removeItem('token');
	}
};

export const clearAuthToken = () => setAuthToken(null);

// Auth
export const registerUser = async (payload) => {
	const { data } = await api.post('/auth/register', payload);
	return data;
};

export const loginUser = async (payload) => {
	const { data } = await api.post('/auth/login', payload);
	return data;
};

export const fetchCurrentUser = async () => {
	const { data } = await api.get('/auth/me');
	return data;
};

export const logoutUser = async () => {
	try {
		await api.post('/auth/logout');
	} catch (err) {
		console.warn('Logout warning:', err?.message || err);
	}
	clearAuthToken();
};

// Expenses
export const getExpenses = async () => {
	const { data } = await api.get('/expenses');
	return data;
};

export const createExpense = async (payload) => {
	const { data } = await api.post('/expenses', payload);
	return data;
};

export const deleteExpense = async (id) => {
	await api.delete(`/expenses/${id}`);
};

export const updateExpense = async (id, payload) => {
	const { data } = await api.put(`/expenses/${id}`, payload);
	return data;
};

// Budgets
export const getBudgets = async () => {
	const { data } = await api.get('/budgets');
	return data;
};

export const createBudget = async (payload) => {
	const { data } = await api.post('/budgets', payload);
	return data;
};

export const updateBudget = async (id, payload) => {
	const { data } = await api.put(`/budgets/${id}`, payload);
	return data;
};

export const deleteBudget = async (id) => {
	await api.delete(`/budgets/${id}`);
};

// Income
export const getIncomes = async () => {
	const { data } = await api.get('/income');
	return data;
};

export const createIncome = async (payload) => {
	const { data } = await api.post('/income', payload);
	return data;
};

export const deleteIncome = async (id) => {
	await api.delete(`/income/${id}`);
};

// Recurring expenses
export const getRecurring = async () => {
	const { data } = await api.get('/recurring');
	return data;
};

export const createRecurring = async (payload) => {
	const { data } = await api.post('/recurring', payload);
	return data;
};

export const updateRecurring = async (id, payload) => {
	const { data } = await api.put(`/recurring/${id}`, payload);
	return data;
};

export const deleteRecurring = async (id) => {
	await api.delete(`/recurring/${id}`);
};

// Debts
export const getDebts = async () => {
	const { data } = await api.get('/debts');
	return data;
};

export const createDebt = async (payload) => {
	const { data } = await api.post('/debts', payload);
	return data;
};

export const updateDebt = async (id, payload) => {
	const { data } = await api.put(`/debts/${id}`, payload);
	return data;
};

export const deleteDebt = async (id) => {
	await api.delete(`/debts/${id}`);
};

export default api;
