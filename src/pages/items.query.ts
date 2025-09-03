import api from '../services/api';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useItems(spaceId: string) {
  return useInfiniteQuery({
    queryKey: ['items', spaceId],
    queryFn: async ({ pageParam = null }: { pageParam?: any }) => {
      const res = await api.get(`/spaces/${spaceId}/items`, { params: { cursor: pageParam } });
      return res.data; // { items: [], nextCursor }
    },
    getNextPageParam: (last: any) => last.nextCursor || undefined,
    initialPageParam: null,
  });
}

export function useCreateItem(spaceId: string) {
  const qc = useQueryClient();
  return (useMutation as any)({
    mutationFn: async (formData: FormData | { content?: string }) => {
      if (formData instanceof FormData) {
        const res = await api.post(`/spaces/${spaceId}/items`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
      }
      const res = await api.post(`/spaces/${spaceId}/items`, formData);
      return res.data;
    },
    onMutate: async (newItem: any) => {
      await qc.cancelQueries({ queryKey: ['items', spaceId] });
      const previous = qc.getQueryData(['items', spaceId]);
      // Prepend to first page
      qc.setQueryData(['items', spaceId], (old: any) => {
        if (!old) return old;
        const pages = [...old.pages];
        pages[0] = { ...pages[0], items: [{ _id: 'temp-' + Date.now(), ...newItem }, ...pages[0].items] };
        return { ...old, pages };
      });
      return { previous };
    },
    onError: (_err: any, _vars: any, context: any) => {
      qc.setQueryData(['items', spaceId], context?.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['items', spaceId] }),
  });
}

export function useDeleteItem(spaceId: string) {
  const qc = useQueryClient();
  return (useMutation as any)({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/spaces/${spaceId}/items/${id}`);
      return res.data;
    },
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: ['items', spaceId] });
      const previous = qc.getQueryData(['items', spaceId]);
      qc.setQueryData(['items', spaceId], (old: any) => {
        if (!old) return old;
        const pages = old.pages.map((p: any) => ({ ...p, items: p.items.filter((it: any) => it._id !== id) }));
        return { ...old, pages };
      });
      return { previous };
    },
    onError: (_err: any, _vars: any, context: any) => qc.setQueryData(['items', spaceId], context?.previous),
    onSettled: () => qc.invalidateQueries({ queryKey: ['items', spaceId] }),
  });
}
