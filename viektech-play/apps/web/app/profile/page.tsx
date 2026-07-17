'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth-context';
import { usersApi } from '../lib/api-client';

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      // router.push('/login');
      // return;
    }
    if (user) {
      setDisplayName(user.displayName);
      setEmail(user.email);
    }
  }, [user, authLoading]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !user) return;
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      await usersApi.update(user.id, { displayName }, token);
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Update failed');
    } finally {
      setSaving(false);
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
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">
          Manage your account settings
        </p>
      </div>

      <div className="grid gap-8">
        {/* Profile Card */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xl font-bold text-white">
              {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold">{user?.displayName}</h2>
              <p className="text-sm text-zinc-500">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{user?.totalScore || 0}</div>
              <div className="text-xs text-zinc-500">Total Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{user?.gamesPlayed || 0}</div>
              <div className="text-xs text-zinc-500">Games Played</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{user?.role || 'PLAYER'}</div>
              <div className="text-xs text-zinc-500">Role</div>
            </div>
          </div>
        </div>

        {/* Edit Profile */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>

          <form onSubmit={handleUpdate} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm">
                {success}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 cursor-not-allowed text-zinc-500"
              />
              <p className="text-xs text-zinc-500 mt-1">Email cannot be changed</p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Account Actions */}
        <div className="p-6 rounded-2xl border border-red-200 dark:border-red-900/30 bg-white dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
            Danger Zone
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <div className="flex gap-3">
            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Sign Out
            </button>
            {token && user && (
              <button
                onClick={async () => {
                  if (confirm('Are you sure you want to delete your account?')) {
                    try {
                      await usersApi.delete(user.id, token);
                      logout();
                      router.push('/');
                    } catch (err: any) {
                      setError(err.message);
                    }
                  }
                }}
                className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Delete Account
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}