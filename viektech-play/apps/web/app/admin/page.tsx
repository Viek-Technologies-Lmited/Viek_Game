'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth-context';
import { adminApi, questionsApi, gamesApi, usersApi } from '../lib/api-client';
import type { DashboardStats, GameMode, Category, UserProfile } from '@viekplay/shared-types';

export default function AdminPage() {
  const router = useRouter();
  const { token, isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [gameModes, setGameModes] = useState<GameMode[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // New mode form
  const [newModeName, setNewModeName] = useState('');
  const [newModeSlug, setNewModeSlug] = useState('');
  const [creating, setCreating] = useState(false);

  // New category form
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [creatingCat, setCreatingCat] = useState(false);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      router.push('/');
      return;
    }
    if (!token) return;
    loadData();
  }, [token, authLoading]);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [statsData, usersData, modes, cats] = await Promise.all([
        adminApi.getStats(token).catch(() => null),
        usersApi.getAll(token).catch(() => []),
        gamesApi.getGameModes(token).catch(() => []),
        questionsApi.getCategories(token).catch(() => []),
      ]);
      setStats(statsData);
      setUsers(usersData || []);
      setGameModes(modes || []);
      setCategories(cats || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newModeName) return;
    setCreating(true);
    try {
      await gamesApi.createGameMode({ name: newModeName, slug: newModeSlug || undefined }, token);
      setNewModeName('');
      setNewModeSlug('');
      const modes = await gamesApi.getGameModes(token);
      setGameModes(modes || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newCatName) return;
    setCreatingCat(true);
    try {
      await questionsApi.createCategory({ name: newCatName, slug: newCatSlug || undefined }, token);
      setNewCatName('');
      setNewCatSlug('');
      const cats = await questionsApi.getCategories(token);
      setCategories(cats || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreatingCat(false);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">
          Manage your gaming platform
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Users', value: users.length.toString(), icon: '👥', color: 'from-blue-500 to-blue-600' },
          { label: 'Game Modes', value: gameModes.length.toString(), icon: '🎮', color: 'from-purple-500 to-purple-600' },
          { label: 'Categories', value: categories.length.toString(), icon: '📚', color: 'from-green-500 to-green-600' },
          { label: 'Status', value: stats?.status || 'ok', icon: '✅', color: 'from-amber-500 to-amber-600' },
        ].map((card, i) => (
          <div key={i} className="p-4 rounded-2xl bg-gradient-to-br ${card.color} text-white">
            <div className="text-2xl mb-1">{card.icon}</div>
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="text-xs text-white/70">{card.label}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Game Modes */}
          <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <h2 className="text-lg font-semibold mb-4">Game Modes</h2>

            <form onSubmit={handleCreateMode} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newModeName}
                onChange={(e) => setNewModeName(e.target.value)}
                placeholder="Mode name"
                required
                className="flex-1 px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <input
                type="text"
                value={newModeSlug}
                onChange={(e) => setNewModeSlug(e.target.value)}
                placeholder="slug (optional)"
                className="flex-1 px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 text-sm hidden sm:block"
              />
              <button
                type="submit"
                disabled={creating}
                className="px-4 py-2 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {creating ? '...' : 'Add'}
              </button>
            </form>

            <div className="space-y-2">
              {gameModes.map((mode) => (
                <div key={mode.id} className="flex items-center justify-between p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                  <span className="font-medium text-sm">{mode.name}</span>
                  <span className="text-xs text-zinc-500">{mode.slug}</span>
                </div>
              ))}
              {gameModes.length === 0 && (
                <p className="text-sm text-zinc-500 text-center py-4">No game modes yet</p>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <h2 className="text-lg font-semibold mb-4">Categories</h2>

            <form onSubmit={handleCreateCategory} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Category name"
                required
                className="flex-1 px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <input
                type="text"
                value={newCatSlug}
                onChange={(e) => setNewCatSlug(e.target.value)}
                placeholder="slug (optional)"
                className="flex-1 px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 text-sm hidden sm:block"
              />
              <button
                type="submit"
                disabled={creatingCat}
                className="px-4 py-2 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {creatingCat ? '...' : 'Add'}
              </button>
            </form>

            <div className="space-y-2">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                  <span className="font-medium text-sm">{cat.name}</span>
                  <span className="text-xs text-zinc-500">{cat.slug}</span>
                </div>
              ))}
              {categories.length === 0 && (
                <p className="text-sm text-zinc-500 text-center py-4">No categories yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}