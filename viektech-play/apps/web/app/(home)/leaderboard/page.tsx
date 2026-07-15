'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { leaderboardApi, organizationsApi } from '../../lib/api-client';
import type { LeaderboardEntry, Organization } from '@viekplay/shared-types';

export default function LeaderboardPage() {
  const router = useRouter();
  const { token, isAuthenticated, isLoading: authLoading } = useAuth();

  const [globalLeaders, setGlobalLeaders] = useState<LeaderboardEntry[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string>('');
  const [orgLeaders, setOrgLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
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
      const [global, orgs] = await Promise.all([
        leaderboardApi.getGlobal(token),
        organizationsApi.getAll(token).catch(() => []),
      ]);
      setGlobalLeaders(global || []);
      setOrganizations(orgs || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOrgChange = async (orgId: string) => {
    if (!token) return;
    setSelectedOrg(orgId);
    if (!orgId) {
      setOrgLeaders([]);
      return;
    }
    try {
      const leaders = await leaderboardApi.getByOrganization(orgId, token);
      setOrgLeaders(leaders || []);
    } catch {
      setOrgLeaders([]);
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-500';
      case 2: return 'text-zinc-400';
      case 3: return 'text-amber-700';
      default: return 'text-zinc-500';
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-yellow-500/20 border-yellow-500/30';
      case 2: return 'bg-zinc-400/10 border-zinc-400/20';
      case 3: return 'bg-amber-700/20 border-amber-700/30';
      default: return 'bg-white/5 border-white/10';
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
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Leaderboard
          </span>
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">
          Top players and organization rankings
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Global Leaderboard */}
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            🌍 Global Rankings
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" />
            </div>
          ) : globalLeaders.length === 0 ? (
            <div className="text-center py-12 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700">
              <div className="text-4xl mb-3">🏆</div>
              <p className="text-zinc-600 dark:text-zinc-400">No rankings yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {globalLeaders.map((entry, i) => (
                <div
                  key={entry.userId}
                  className={`flex items-center justify-between p-3 rounded-xl border ${getRankBg(i + 1)}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${getRankStyle(i + 1)}`}>
                      {i + 1}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                      {entry.displayName?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{entry.displayName}</div>
                      <div className="text-xs text-zinc-500">{entry.gamesPlayed} games</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-yellow-400">{entry.score}</div>
                    <div className="text-xs text-zinc-500">pts</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Organization Leaderboard */}
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            🏢 Organization Rankings
          </h2>

          <div className="mb-4">
            <select
              value={selectedOrg}
              onChange={(e) => handleOrgChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an organization</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          </div>

          {!selectedOrg ? (
            <div className="text-center py-12 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700">
              <div className="text-4xl mb-3">🏢</div>
              <p className="text-zinc-600 dark:text-zinc-400">
                Select an organization to view rankings
              </p>
            </div>
          ) : orgLeaders.length === 0 ? (
            <div className="text-center py-12 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700">
              <div className="text-4xl mb-3">📊</div>
              <p className="text-zinc-600 dark:text-zinc-400">
                No rankings for this organization yet
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {orgLeaders.map((entry, i) => (
                <div
                  key={entry.userId}
                  className={`flex items-center justify-between p-3 rounded-xl border ${getRankBg(i + 1)}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${getRankStyle(i + 1)}`}>
                      {i + 1}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                      {entry.displayName?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{entry.displayName}</div>
                      <div className="text-xs text-zinc-500">{entry.gamesPlayed} games</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-yellow-400">{entry.score}</div>
                    <div className="text-xs text-zinc-500">pts</div>
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