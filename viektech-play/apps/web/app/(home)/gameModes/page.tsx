"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth-context";
import { gamesApi } from "../../lib/api-client";
import type { GameMode } from "@viekplay/shared-types";

const TIMER_PRESETS = [10, 15, 30, 60];

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function GameModesPage() {
  const router = useRouter();
  const { token, isAuthenticated, isLoading: authLoading } = useAuth();
  const [gameModes, setGameModes] = useState<GameMode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [modeName, setModeName] = useState("");
  const [modeTimer, setModeTimer] = useState(15);
  const [creatingMode, setCreatingMode] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!token) return;
    loadGameModes();
  }, [token, authLoading]);

  const loadGameModes = async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const modes = await gamesApi.getGameModes(token);
      setGameModes(modes || []);
    } catch (err: any) {
      setError(err.message || "Failed to load game modes");
    } finally {
      setLoading(false);
    }
  };

  const flashSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleCreateMode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !modeName.trim()) {
      setError("Game mode name is required");
      return;
    }

    if (
      gameModes.some((m) => m.name.toLowerCase() === modeName.toLowerCase())
    ) {
      setError("Game mode already exists");
      return;
    }

    setCreatingMode(true);
    setError("");
    try {
      await gamesApi.createGameMode(
        {
          name: modeName,
          slug: slugify(modeName),
          timePerQuestionSeconds: modeTimer,
        },
        token,
      );
      setModeName("");
      setModeTimer(15);
      await loadGameModes();
      flashSuccess(`"${modeName}" game mode created!`);
    } catch (err: any) {
      setError(err.message || "Failed to create game mode");
    } finally {
      setCreatingMode(false);
    }
  };

  const handleDeleteMode = async (id: string, name: string) => {
    if (!token) return;
    if (!confirm(`Delete game mode "${name}"? This cannot be undone.`)) return;

    setDeleting(id);
    setError("");
    try {
      await gamesApi.deleteGameMode(id, token);
      await loadGameModes();
      flashSuccess(`"${name}" deleted`);
    } catch (err: any) {
      setError(err.message || "Failed to delete game mode");
    } finally {
      setDeleting(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Game Modes</h1>
        <p className="text-gray-600 mt-1">
          Create and manage game modes for your quiz platform
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-600 text-sm">
          {success}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Create Game Mode */}
        <div className="lg:col-span-1 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold mb-4 text-gray-800">Create Mode</h2>

          <form onSubmit={handleCreateMode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mode Name
              </label>
              <input
                type="text"
                value={modeName}
                onChange={(e) => setModeName(e.target.value)}
                placeholder="e.g., Quick Play, Blitz"
                required
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seconds per Question
              </label>
              <div className="flex gap-2 mb-2">
                {TIMER_PRESETS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setModeTimer(t)}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                      modeTimer === t
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600"
                    }`}
                  >
                    {t}s
                  </button>
                ))}
              </div>
              <input
                type="number"
                min={5}
                max={180}
                value={modeTimer}
                onChange={(e) => setModeTimer(parseInt(e.target.value) || 15)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={creatingMode}
              className="w-full py-2.5 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 text-sm"
            >
              {creatingMode ? "Creating..." : "+ Create Mode"}
            </button>
          </form>
        </div>

        {/* Game Modes List */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold mb-4 text-gray-800">
            Game Modes ({gameModes.length})
          </h2>

          {gameModes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No game modes yet. Create one to get started.
            </p>
          ) : (
            <div className="space-y-2">
              {gameModes.map((mode) => (
                <div
                  key={mode.id}
                  className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 text-sm">
                      {mode.name}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      {mode.slug}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="font-medium">
                      {mode.timePerQuestionSeconds}s per question
                    </span>
                    <button
                      onClick={() => handleDeleteMode(mode.id, mode.name)}
                      disabled={deleting === mode.id}
                      className="px-3 py-1.5 text-xs text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                    >
                      {deleting === mode.id ? "Deleting..." : "Delete"}
                    </button>
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
