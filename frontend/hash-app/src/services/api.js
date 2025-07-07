import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:7777/api', // Базовый URL бэкенда
  withCredentials: true, // Включаем отправку куки
});

export default api;