// Serviço de autenticação
import api from './api';

export async function login(username: string, password: string) {
  return api.post('/', { username, password });
}

export async function register(username: string, password: string) {
  return api.post('/register', { username, password });
}
