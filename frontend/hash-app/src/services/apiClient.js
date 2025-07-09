import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : 'http://localhost:7777/api',
  withCredentials: true, // включаем передачу куки
});

export default apiClient;
