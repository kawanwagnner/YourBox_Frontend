// Instância React Query
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			staleTime: 10000, // 10s
		},
		mutations: {
			retry: 1,
		},
	},
});

export default queryClient;
