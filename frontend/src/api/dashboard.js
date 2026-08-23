import { apiClient } from './client';

export async function fetchDashboardSummary() {
  const { data } = await apiClient.get('/api/admin/dashboard/summary');
  return data;
}

export async function fetchTopProducts(limit = 5) {
  const { data } = await apiClient.get('/api/admin/dashboard/top-products', { params: { limit } });
  return data;
}

export async function fetchSalesReport(startDate, endDate) {
  const { data } = await apiClient.get('/api/admin/dashboard/sales-report', {
    params: { startDate, endDate },
  });
  return data;
}