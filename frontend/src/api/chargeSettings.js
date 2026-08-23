import { apiClient } from './client';

export async function fetchChargeSettings() {
  const { data } = await apiClient.get('/api/admin/settings/charges');
  return data;
}

export async function updateChargeSettings(payload) {
  const { data } = await apiClient.put('/api/admin/settings/charges', payload);
  return data;
}