// Serviço de spaces
import api from './api';

export async function getSpaces() {
  return api.get('/spaces');
}

export async function createSpace(name: string) {
  return api.post('/spaces', { name });
}
