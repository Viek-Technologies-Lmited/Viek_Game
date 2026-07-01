'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../lib/auth-context';
import { gamesApi, questionsApi } from '../lib/api-client';
import type { GameMode, GameSession, Category } from '@viekplay/shared-types';

export default function GamesPage() {
  const router = useRouter();
  const { token, user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [gameModes, setGameModes] = useState<GameMode[]>([]);
  const [activeSessions, setActiveSessions] = useState<GameSession[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedMode, setSelectedMode] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!token) return;
    loadData();
  }, [token, authLoading]);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [modes, sessions, cats] = await Promise.all([
        gamesApi.getGameModes(token),
        gamesApi.getActiveSessions(token).catch(() => []),
        questionsApi.getCategories(token).catch(() => []),
      ]);
      setGameModes(modes);
      setActiveSessions(sessions || []);
      setCategories(cats || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async () => {
    if (!token || !selectedMode) return;
    setCreating(true);
    setError('');
    try {
      const session = await gamesApi.createSession(
        {
          gameModeId: selectedMode,
          categoryId: selectedCategory || undefined,
        },
        token
      );
      router.push(`/games/${session.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleJoinSession = async (sessionId: string) => {
    if (!token) return;
    try {
      await gamesApi.joinSession(sessionId, token);
      router.push(`/games/${sessionId}`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-400';
      case 'IN_PROGRESS': return 'bg-green-400';
      case 'COMPLETED': return 'bg-zinc-400';
      default: return 'bg-zinc-400';
    }
  };

  if (authLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Game Lobby</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">
          Choose a game mode or join an existing session
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Create Game */}
        <div className="lg:col-span-1">
          <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <h2 className="text-lg font-semibold mb-4">Create New Game</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Game Mode</label>
                <select
                  value={selectedMode}
                  onChange={(e) => setSelectedMode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a mode</option>
                  {gameModes.map((mode) => (
                    <option key={mode.id} value={mode.id}>{mode.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category (optional)</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleCreateSession}
                disabled={!selectedMode || creating}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create Game'}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Active Sessions */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Active Sessions</h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" />
            </div>
          ) : activeSessions.length === 0 ? (
            <div className="text-center py-12 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700">
              <div className="text-4xl mb-3">🎮</div>
              <p className="text-zinc-600 dark:text-zinc-400">
                No active sessions. Create one to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 card-hover"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(session.status)}`} />
                    <div>
                      <div className="font-medium">
                        {session.gameMode?.name || 'Quick Play'}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {session.participants?.length || 0}/{session.maxParticipants} players
                        {session.category && ` • ${session.category.name}`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      session.status === 'PENDING' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                      session.status === 'IN_PROGRESS' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                      'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                    }`}>
                      {session.status.replace('_', ' ')}
                    </span>
                    {session.status === 'PENDING' && (
                      <button
                        onClick={() => handleJoinSession(session.id)}
                        className="px-3 py-1.5 rounded-full bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
                      >
                        Join
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}