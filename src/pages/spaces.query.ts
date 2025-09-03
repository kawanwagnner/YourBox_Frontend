import api from '../services/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useSpaces() {
  return useQuery({
    queryKey: ['spaces'],
    queryFn: async () => {
      const res = await api.get('/spaces');
      return res.data;
    },
  });
}

export function useCreateSpace() {
  const qc = useQueryClient();
  return useMutation<any, any, string, any>({
    mutationFn: async (name: string) => {
      const res = await api.post('/spaces', { name });
      return res.data;
    },
    onMutate: async (name: string) => {
      await qc.cancelQueries({ queryKey: ['spaces'] });
      const previous = qc.getQueryData(['spaces']);
      qc.setQueryData(['spaces'], (old: any[] = []) => [...old, { _id: 'temp-' + Date.now(), name }]);
      return { previous };
    },
    onError: (_err: any, _vars: any, context: any) => {
      qc.setQueryData(['spaces'], context?.previous);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['spaces'] });
    },
  });
}

export function useUpdateSpace() {
  const qc = useQueryClient();
  return useMutation<any, any, { id: string; name: string }, any>({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const res = await api.put(`/spaces/${id}`, { name });
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['spaces'] }),
  });
}

export function useDeleteSpace() {
  const qc = useQueryClient();
  return useMutation<any, any, string, any>({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/spaces/${id}`);
      return res.data;
    },
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: ['spaces'] });
      const previous = qc.getQueryData(['spaces']);
      qc.setQueryData(['spaces'], (old: any[] = []) => old.filter((s) => s._id !== id));
      return { previous };
    },
    onError: (_err: any, _vars: any, context: any) => qc.setQueryData(['spaces'], context?.previous),
    onSettled: () => qc.invalidateQueries({ queryKey: ['spaces'] }),
  });
}
