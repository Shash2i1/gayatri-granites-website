import { apiClient } from './client';

export async function fetchUsers() {
  const { data } = await apiClient.get('/api/admin/users');
  return data;
}

export async function fetchUserDetail(id) {
  const { data } = await apiClient.get(`/api/admin/users/${id}`);
  return data;
}

export async function updateUserStatus(id, blocked) {
  const { data } = await apiClient.put(`/api/admin/users/${id}/status`, { blocked });
  return data;
}