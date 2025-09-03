// Redireciona se não logado
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../state/auth.store';

export function useAuthGuard() {
  const navigate = useNavigate();
  const { token } = useAuthStore();

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);
}
