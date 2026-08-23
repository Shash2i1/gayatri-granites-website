import { apiClient } from './client';

export async function fetchProducts() {
  const { data } = await apiClient.get('/api/admin/products');
  return data;
}

export async function fetchProduct(id) {
  const { data } = await apiClient.get(`/api/admin/products/${id}`);
  return data;
}

export async function createProduct(payload) {
  const { data } = await apiClient.post('/api/admin/products', payload);
  return data;
}

export async function updateProduct(id, payload) {
  const { data } = await apiClient.put(`/api/admin/products/${id}`, payload);
  return data;
}

export async function deactivateProduct(id) {
  await apiClient.delete(`/api/admin/products/${id}`);
}

export async function uploadProductImage(id, file, isPrimary, displayOrder) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('isPrimary', isPrimary);
  if (displayOrder != null) formData.append('displayOrder', displayOrder);

  const { data } = await apiClient.post(`/api/admin/products/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function deleteProductImage(imageId) {
  await apiClient.delete(`/api/admin/products/images/${imageId}`);
}

export async function updateStock(id, totalStockQuantity) {
  const { data } = await apiClient.put(`/api/admin/products/${id}/stock`, { totalStockQuantity });
  return data;
}

export async function updatePrice(id, basePrice) {
  const { data } = await apiClient.put(`/api/admin/products/${id}/price`, { basePrice });
  return data;
}

export async function updateDiscount(id, discountPrice) {
  const { data } = await apiClient.put(`/api/admin/products/${id}/discount`, { discountPrice });
  return data;
}

export async function addVariant(id, payload) {
  const { data } = await apiClient.post(`/api/admin/products/${id}/variants`, payload);
  return data;
}