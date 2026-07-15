'use client';

import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000';

export function useSocket(token: string | null) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    const socket = io(WS_URL, {
      transports: ['polling', 'websocket'],
      auth: { token },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  const joinGame = useCallback((sessionId: string, userId: string) => {
    socketRef.current?.emit('joinGame', { sessionId, userId });
  }, []);

  const leaveGame = useCallback((sessionId: string, userId: string) => {
    socketRef.current?.emit('leaveGame', { sessionId, userId });
  }, []);

  const submitAnswer = useCallback((sessionId: string, userId: string, questionId: string, optionId: string) => {
    socketRef.current?.emit('submitAnswer', { sessionId, userId, questionId, optionId });
  }, []);

  const onNextQuestion = useCallback((handler: (data: any) => void) => {
    socketRef.current?.on('nextQuestion', handler);
    return () => {
      socketRef.current?.off('nextQuestion', handler);
    };
  }, []);

  const onGameEnded = useCallback((handler: (data: any) => void) => {
    socketRef.current?.on('gameEnded', handler);
    return () => {
      socketRef.current?.off('gameEnded', handler);
    };
  }, []);

  const onUserJoined = useCallback((handler: (data: { userId: string; displayName?: string }) => void) => {
    socketRef.current?.on('userJoined', handler);
    return () => {
      socketRef.current?.off('userJoined', handler);
    };
  }, []);

  const onUserLeft = useCallback((handler: (data: { userId: string }) => void) => {
    socketRef.current?.on('userLeft', handler);
    return () => {
      socketRef.current?.off('userLeft', handler);
    };
  }, []);

  const onAnswerReceived = useCallback((handler: (data: any) => void) => {
    socketRef.current?.on('answerReceived', handler);
    return () => {
      socketRef.current?.off('answerReceived', handler);
    };
  }, []);

  return {
    socket: socketRef.current,
    joinGame,
    leaveGame,
    submitAnswer,
    onNextQuestion,
    onGameEnded,
    onUserJoined,
    onUserLeft,
    onAnswerReceived,
  };
}