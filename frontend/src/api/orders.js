import { apiClient, API_BASE_URL } from './client';

export async function fetchOrders() {
  const { data } = await apiClient.get('/api/admin/orders');
  return data;
}

export async function fetchOrder(id) {
  const { data } = await apiClient.get(`/api/admin/orders/${id}`);
  return data;
}

export async function updateOrderStatus(id, status) {
  const { data } = await apiClient.put(`/api/admin/orders/${id}/status`, { status });
  return data;
}

export async function assignTransport(id, transportDetails) {
  const { data } = await apiClient.put(`/api/admin/orders/${id}/assign-transport`, { transportDetails });
  return data;
}

export async function processRefund(id, refundReason) {
  const { data } = await apiClient.put(`/api/admin/orders/${id}/refund`, { refundReason });
  return data;
}

export function getInvoiceUrl(id) {
  return `${API_BASE_URL}/api/admin/orders/${id}/invoice`;
}