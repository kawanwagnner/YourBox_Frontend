// Serviço de itens
import api from './api';

export async function getItems(spaceId: string) {
  return api.get(`/spaces/${spaceId}/items`);
}

export async function createItem(spaceId: string, data: any) {
  return api.post(`/spaces/${spaceId}/items`, data);
}
