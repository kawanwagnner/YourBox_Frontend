// Conecta socket e join na room do space
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocketSpace(spaceId: string) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!spaceId) return;
    const token = localStorage.getItem('auth_token');
    const socket = io(import.meta.env.VITE_SOCKET_URL || '', {
      auth: { token },
    });
    socketRef.current = socket;
    socket.emit('join:space', { spaceId });

    return () => {
      try {
        socket.emit('leave:space', { spaceId });
        socket.disconnect();
      } catch {}
      socketRef.current = null;
    };
  }, [spaceId]);

  return socketRef;
}
