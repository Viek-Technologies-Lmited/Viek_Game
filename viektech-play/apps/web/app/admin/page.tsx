"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/auth-context";
import { questionsApi, gamesApi, adminApi, usersApi } from "../lib/api-client";
import type {
  DashboardStats,
  GameMode,
  Category,
  UserProfile,
} from "@viekplay/shared-types";

interface OptionInput {
  text: string;
  isCorrect: boolean;
}

const COMMON_CATEGORIES = [
  "General Knowledge",
  "Science",
  "Technology",
  "History",
  "Geography",
  "Sports",
  "Entertainment",
  "Nigeria",
  "Custom...",
];

const TIMER_PRESETS = [10, 15, 30, 60];

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminPage() {
  const router = useRouter();
  const {
    token,
    user,
    isAuthenticated,
    isAdmin,
    isLoading: authLoading,
  } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [gameModes, setGameModes] = useState<GameMode[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [catPreset, setCatPreset] = useState(COMMON_CATEGORIES[0]);
  const [customCatName, setCustomCatName] = useState("");
  const [creatingCat, setCreatingCat] = useState(false);

  const [newModeName, setNewModeName] = useState("");
  const [newModeTimer, setNewModeTimer] = useState(15);
  const [creatingMode, setCreatingMode] = useState(false);

  const [qText, setQText] = useState("");
  const [qCategoryId, setQCategoryId] = useState("");
  const [qDifficulty, setQDifficulty] = useState(1);
  const [qOptions, setQOptions] = useState<OptionInput[]>([
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);
  const [creatingQuestion, setCreatingQuestion] = useState(false);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      // router.push("/login");
      // return;
    }
    if (!token) return;
    loadData();
  }, [token, authLoading]);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [statsData, usersData, modes, cats, qs] = await Promise.all([
        adminApi.getStats(token).catch(() => null),
        usersApi.getAll(token).catch(() => []),
        gamesApi.getGameModes(token).catch(() => []),
        questionsApi.getCategories(token).catch(() => []),
        questionsApi.getAll(token).catch(() => []),
      ]);
      setStats(statsData);
      setUsers(usersData || []);
      setGameModes(modes || []);
      setCategories(cats || []);
      setQuestions(qs || []);

      setQCategoryId((prev) => {
        if (!cats || cats.length === 0) return "";
        const stillExists = cats.some((c) => c.id === prev);
        return stillExists ? prev : cats[0].id;
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const flashSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const name = catPreset === "Custom..." ? customCatName.trim() : catPreset;
    if (!name) return;
    setCreatingCat(true);
    setError("");
    try {
      await questionsApi.createCategory({ name, slug: slugify(name) }, token);
      setCustomCatName("");
      setCatPreset(COMMON_CATEGORIES[0]);
      await loadData();
      flashSuccess(`"${name}" category created`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreatingCat(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!token) return;
    if (!confirm(`Delete category "${name}"? This cannot be undone.`)) return;
    setError("");
    try {
      await questionsApi.deleteCategory(id, token);
      await loadData();
      flashSuccess(`"${name}" deleted`);
    } catch (err: any) {
      setError(
        err.message || "Could not delete — it may be in use by a game session",
      );
    }
  };

  const handleCreateMode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newModeName.trim()) return;
    setCreatingMode(true);
    setError("");
    try {
      await gamesApi.createGameMode(
        {
          name: newModeName.trim(),
          slug: slugify(newModeName),
          timePerQuestionSeconds: newModeTimer,
        },
        token,
      );
      setNewModeName("");
      setNewModeTimer(15);
      await loadData();
      flashSuccess("Game mode created");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreatingMode(false);
    }
  };

  const handleDeleteMode = async (id: string, name: string) => {
    if (!token) return;
    if (!confirm(`Delete game mode "${name}"? This cannot be undone.`)) return;
    setError("");
    try {
      await gamesApi.deleteGameMode(id, token);
      await loadData();
      flashSuccess(`"${name}" deleted`);
    } catch (err: any) {
      setError(
        err.message || "Could not delete — it may be in use by a game session",
      );
    }
  };

  const updateOptionText = (index: number, text: string) => {
    setQOptions((prev) =>
      prev.map((o, i) => (i === index ? { ...o, text } : o)),
    );
  };

  const setCorrectOption = (index: number) => {
    setQOptions((prev) =>
      prev.map((o, i) => ({ ...o, isCorrect: i === index })),
    );
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !qText || !qCategoryId) return;
    if (qOptions.some((o) => !o.text.trim())) {
      setError("All 4 options need text");
      return;
    }
    setCreatingQuestion(true);
    setError("");
    try {
      await questionsApi.create(
        {
          text: qText,
          categoryId: qCategoryId,
          difficulty: qDifficulty,
          options: qOptions.map((o, i) => ({
            text: o.text,
            isCorrect: o.isCorrect,
            order: i,
          })),
        },
        token,
      );
      setQText("");
      setQOptions([
        { text: "", isCorrect: true },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ]);
      await loadData();
      flashSuccess("Question created");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreatingQuestion(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-[#0b1120]">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const inputClass =
    "w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-[#0b1120] text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors";

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1
              className="text-3xl font-bold"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Welcome, {user?.displayName?.split(" ")[0] || "Admin"}
            </h1>
            <p className="text-slate-400 mt-1">Manage your gaming platform</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
            Admin Access
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-300 text-sm">
            {success}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Users",
              value: users.length.toString(),
              icon: "👥",
              accent: "from-blue-500/20 to-blue-600/5 border-blue-500/20",
            },
            {
              label: "Game Modes",
              value: gameModes.length.toString(),
              icon: "🎮",
              accent: "from-purple-500/20 to-purple-600/5 border-purple-500/20",
            },
            {
              label: "Categories",
              value: categories.length.toString(),
              icon: "📚",
              accent: "from-green-500/20 to-green-600/5 border-green-500/20",
            },
            {
              label: "Questions",
              value: questions.length.toString(),
              icon: "❓",
              accent: "from-amber-500/20 to-amber-600/5 border-amber-500/20",
            },
          ].map((card, i) => (
            <div
              key={i}
              className={`panel bg-gradient-to-br ${card.accent} p-5`}
            >
              <div className="text-2xl mb-2">{card.icon}</div>
              <div
                className="text-3xl font-extrabold"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {card.value}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">{card.label}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Categories */}
            <div className="panel p-6">
              <h2
                className="text-lg font-bold mb-1"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Categories
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Pick a common category or add your own
              </p>

              <form onSubmit={handleCreateCategory} className="space-y-3 mb-5">
                <select
                  value={catPreset}
                  onChange={(e) => setCatPreset(e.target.value)}
                  className={inputClass}
                >
                  {COMMON_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                {catPreset === "Custom..." && (
                  <input
                    type="text"
                    value={customCatName}
                    onChange={(e) => setCustomCatName(e.target.value)}
                    placeholder="Enter custom category name"
                    required
                    className={inputClass}
                  />
                )}

                <button
                  type="submit"
                  disabled={creatingCat}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50"
                >
                  {creatingCat ? "Adding..." : "+ Add Category"}
                </button>
              </form>

              <div className="space-y-2">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/5"
                  >
                    <div>
                      <span className="font-medium text-sm">{cat.name}</span>
                      <span className="text-xs text-slate-500 font-mono ml-2">
                        {cat.slug}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="text-red-400 hover:text-red-300 text-xs font-medium px-2 py-1 rounded-lg hover:bg-red-500/10 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                ))}
                {categories.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-6">
                    No categories yet
                  </p>
                )}
              </div>
            </div>

            {/* Game Modes */}
            <div className="panel p-6">
              <h2
                className="text-lg font-bold mb-1"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Game Modes
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Set a name and how long each question stays up
              </p>

              <form onSubmit={handleCreateMode} className="space-y-3 mb-5">
                <input
                  type="text"
                  value={newModeName}
                  onChange={(e) => setNewModeName(e.target.value)}
                  placeholder="e.g. Quick Play, Blitz Round"
                  required
                  className={inputClass}
                />

                <div>
                  <label className="block text-xs text-slate-400 mb-2">
                    Seconds per question
                  </label>
                  <div className="flex gap-2">
                    {TIMER_PRESETS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setNewModeTimer(t)}
                        className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                          newModeTimer === t
                            ? "bg-blue-500 border-blue-500 text-white"
                            : "border-slate-700 text-slate-400 hover:border-blue-500 hover:text-blue-300"
                        }`}
                      >
                        {t}s
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={creatingMode}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-semibold hover:from-purple-600 hover:to-purple-700 transition-all disabled:opacity-50"
                >
                  {creatingMode ? "Adding..." : "+ Add Game Mode"}
                </button>
              </form>

              <div className="space-y-2">
                {gameModes.map((mode: any) => (
                  <div
                    key={mode.id}
                    className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/5"
                  >
                    <span className="font-medium text-sm">{mode.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500">
                        {mode.timePerQuestionSeconds}s / question
                      </span>
                      <button
                        onClick={() => handleDeleteMode(mode.id, mode.name)}
                        className="text-red-400 hover:text-red-300 text-xs font-medium px-2 py-1 rounded-lg hover:bg-red-500/10 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {gameModes.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-6">
                    No game modes yet
                  </p>
                )}
              </div>
            </div>

            {/* Create Question — full width */}
            <div className="panel p-6 lg:col-span-2">
              <h2
                className="text-lg font-bold mb-1"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Create Question
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Add a multiple-choice question with 4 options
              </p>

              {categories.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Create a category first before adding questions.
                </p>
              ) : (
                <form onSubmit={handleCreateQuestion} className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">
                      Question text
                    </label>
                    <input
                      type="text"
                      value={qText}
                      onChange={(e) => setQText(e.target.value)}
                      placeholder="What is the capital of Nigeria?"
                      required
                      className={inputClass}
                    />
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs text-slate-400 mb-1.5">
                        Category
                      </label>
                      <select
                        value={qCategoryId}
                        onChange={(e) => setQCategoryId(e.target.value)}
                        required
                        className={inputClass}
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-40">
                      <label className="block text-xs text-slate-400 mb-1.5">
                        Difficulty (1-5)
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={qDifficulty}
                        onChange={(e) => setQDifficulty(Number(e.target.value))}
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-2">
                      Options — select the correct answer
                    </label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {qOptions.map((opt, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-2 rounded-xl border px-3 py-1 transition-colors ${
                            opt.isCorrect
                              ? "border-green-500/50 bg-green-500/5"
                              : "border-transparent"
                          }`}
                        >
                          <input
                            type="radio"
                            name="correctOption"
                            checked={opt.isCorrect}
                            onChange={() => setCorrectOption(i)}
                            className="w-4 h-4 accent-green-500 flex-shrink-0"
                          />
                          <input
                            type="text"
                            value={opt.text}
                            onChange={(e) =>
                              updateOptionText(i, e.target.value)
                            }
                            placeholder={`Option ${String.fromCharCode(65 + i)}`}
                            required
                            className={`${inputClass} border-slate-700`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={creatingQuestion}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50"
                  >
                    {creatingQuestion ? "Creating..." : "+ Create Question"}
                  </button>
                </form>
              )}

              <div className="mt-6 border-t border-slate-800 pt-4">
                <h3 className="text-sm font-semibold text-slate-400 mb-3">
                  Existing Questions ({questions.length})
                </h3>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {questions.map((q: any) => (
                    <div
                      key={q.id}
                      className="p-3 rounded-xl bg-white/5 text-sm"
                    >
                      <div className="font-medium">{q.text}</div>
                      <div className="text-xs text-slate-500 mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                        {q.options?.map((o: any) => (
                          <span
                            key={o.id}
                            className={
                              o.isCorrect ? "text-green-400 font-medium" : ""
                            }
                          >
                            {o.isCorrect ? "✓ " : ""}
                            {o.text}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  {questions.length === 0 && (
                    <p className="text-sm text-slate-500 text-center py-6">
                      No questions yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
