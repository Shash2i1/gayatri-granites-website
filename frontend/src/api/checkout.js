import { apiClient } from './client';

export async function createCheckoutOrder(payload) {
  const { data } = await apiClient.post('/api/checkout/create-order', payload);
  return data;
}

export async function verifyPayment(payload) {
  const { data } = await apiClient.post('/api/checkout/verify-payment', payload);
  return data;
}