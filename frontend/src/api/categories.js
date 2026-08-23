import { apiClient } from './client';

export async function fetchCategories() {
  const { data } = await apiClient.get('/api/admin/categories');
  return data;
}

export async function createCategory(payload) {
  const { data } = await apiClient.post('/api/admin/categories', payload);
  return data;
}

export async function updateCategory(id, payload) {
  const { data } = await apiClient.put(`/api/admin/categories/${id}`, payload);
  return data;
}

export async function deleteCategory(id) {
  await apiClient.delete(`/api/admin/categories/${id}`);
}