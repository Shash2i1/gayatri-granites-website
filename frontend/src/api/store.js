import { apiClient } from './client';

export async function fetchCategories() {
  const { data } = await apiClient.get('/api/categories');
  return data;
}

export async function fetchAllProducts() {
  const { data } = await apiClient.get('/api/products');
  return data;
}

export async function fetchProductsByCategory(categoryId) {
  const { data } = await apiClient.get(`/api/products/category/${categoryId}`);
  return data;
}

export async function searchProducts(keyword) {
  const { data } = await apiClient.get('/api/products/search', { params: { q: keyword } });
  return data;
}

export async function fetchProductDetail(id) {
  const { data } = await apiClient.get(`/api/products/${id}`);
  return data;
}