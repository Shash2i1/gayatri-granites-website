import { apiClient, API_BASE_URL } from './client';

export async function fetchMyOrders() {
  const { data } = await apiClient.get('/api/orders');
  return data;
}

export async function fetchMyOrder(id) {
  const { data } = await apiClient.get(`/api/orders/${id}`);
  return data;
}

export function getInvoiceUrl(id) {
  return `${API_BASE_URL}/api/orders/${id}/invoice`;
}