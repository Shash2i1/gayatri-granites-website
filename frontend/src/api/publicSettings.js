import { apiClient } from './client';

export async function fetchPublicChargeSettings() {
  const { data } = await apiClient.get('/api/settings/charges');
  return data;
}