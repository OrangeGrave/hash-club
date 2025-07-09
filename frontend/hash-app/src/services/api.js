import apiClient from './apiClient';

/**
 * Регистрация нового пользователя.
 * @param {{ username: string, identity: string, password: string, confirmPassword: string }} params
 * @returns {Promise<{ data: any, status: number }>}
 */
export async function register({ username, identity, password, confirmPassword }) {
  const payload = {
    username,
    identity,
    password,
    passwordConfirm: confirmPassword,
  };
  const response = await apiClient.post('/register', payload);
  return { data: response.data, status: response.status };
}

/**
 * Вход пользователя.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<any>}
 */
export async function login(username, password) {
  const response = await apiClient.post('/login', { username, password });
  return response.data;
}

/**
 * Выход (логаут): сбрасывает HTTP-only куки на сервере.
 * @returns {Promise<void>}
 */
export async function logout() {
  await apiClient.post('/logout');
}

/**
 * Получение защищённой ленты.
 * @returns {Promise<any>}
 */
export async function getFeed() {
  const response = await apiClient.get('/feed');
  return response.data;
}
