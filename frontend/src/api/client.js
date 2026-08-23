import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // sends the httpOnly `token` cookie automatically
  headers: { 'Content-Type': 'application/json' },
});