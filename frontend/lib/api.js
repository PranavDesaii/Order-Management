import axios from 'axios';

const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
});

// Create order
export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

// Get orders by store
export const getOrders = async (storeId, page = 1, limit = 10) => {
  const response = await api.get(`/orders?store_id=${storeId}&page=${page}&limit=${limit}`);
  return response.data;
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  const response = await api.patch(`/orders/${orderId}/status`, { status });
  return response.data;
};

// Analytics
export const getDailyOrders = async () => {
  const response = await api.get('/orders/analytics/daily');
  return response.data;
};

export const getRevenueByStore = async () => {
  const response = await api.get('/orders/analytics/revenue');
  return response.data;
};

export const getTopItems = async () => {
  const response = await api.get('/orders/analytics/top-items');
  return response.data;
};