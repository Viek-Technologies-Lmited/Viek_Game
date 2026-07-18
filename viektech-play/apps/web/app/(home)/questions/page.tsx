"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth-context";
import { questionsApi } from "../../lib/api-client";
import type { Category, Question } from "@viekplay/shared-types";

interface OptionInput {
  text: string;
  isCorrect: boolean;
}

export default function QuestionsPage() {
  const router = useRouter();
  const { token, isAuthenticated, isLoading: authLoading } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [qText, setQText] = useState("");
  const [qDifficulty, setQDifficulty] = useState(1);
  const [qOptions, setQOptions] = useState<OptionInput[]>([
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);
  const [creatingQuestion, setCreatingQuestion] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!token) return;
    loadData();
  }, [token, authLoading]);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const [cats, qs] = await Promise.all([
        questionsApi.getCategories(token),
        questionsApi.getAll(token).catch(() => []),
      ]);
      setCategories(cats || []);
      setQuestions(qs || []);
      if (cats && cats.length > 0 && !selectedCategoryId) {
        setSelectedCategoryId(cats[0].id);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const flashSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
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
    if (!token || !qText.trim() || !selectedCategoryId) {
      setError("Fill in all fields");
      return;
    }
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
          categoryId: selectedCategoryId,
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
      setQDifficulty(1);
      setQOptions([
        { text: "", isCorrect: true },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ]);
      await loadData();
      flashSuccess("Question created!");
    } catch (err: any) {
      setError(err.message || "Failed to create question");
    } finally {
      setCreatingQuestion(false);
    }
  };

  const handleDeleteQuestion = async (id: string, text: string) => {
    if (!token) return;
    if (!confirm(`Delete this question? This cannot be undone.`)) return;

    setDeleting(id);
    setError("");
    try {
      await questionsApi.deleteQuestion(id, token);
      await loadData();
      flashSuccess("Question deleted");
    } catch (err: any) {
      setError(err.message || "Failed to delete question");
    } finally {
      setDeleting(null);
    }
  };

  const filteredQuestions = selectedCategoryId
    ? questions.filter((q) => q.categoryId === selectedCategoryId)
    : questions;

  if (authLoading || loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Questions</h1>
        <p className="text-gray-600 mt-1">Create and manage quiz questions</p>
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

      {categories.length === 0 ? (
        <div className="p-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-center">
          No categories found.{" "}
          <a href="/categories" className="font-bold underline">
            Create a category first
          </a>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Create Question */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              Create Question
            </h2>

            <form onSubmit={handleCreateQuestion} className="space-y-4">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Question Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question
                </label>
                <input
                  type="text"
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  placeholder="What is the capital of Nigeria?"
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty (1-5)
                </label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={qDifficulty}
                  onChange={(e) =>
                    setQDifficulty(parseInt(e.target.value) || 1)
                  }
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Options (Select one as correct)
                </label>
                <div className="space-y-2">
                  {qOptions.map((opt, i) => (
                    <div key={i} className="flex gap-2 items-end">
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => updateOptionText(i, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + i)}`}
                        required
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setCorrectOption(i)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          opt.isCorrect
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {opt.isCorrect ? "✓ Correct" : "Mark"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={creatingQuestion}
                className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
              >
                {creatingQuestion ? "Creating..." : "+ Create Question"}
              </button>
            </form>
          </div>

          {/* Questions List */}
          <div className="lg:col-span-1 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              Questions ({filteredQuestions.length})
            </h2>

            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredQuestions.length === 0 ? (
                <p className="text-gray-500 text-center py-8 text-sm">
                  No questions in this category yet
                </p>
              ) : (
                filteredQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="text-sm font-medium text-gray-800 line-clamp-2">
                      {q.text}
                    </div>
                    <div className="text-xs text-gray-500 mt-1.5 flex justify-between items-center">
                      <span>Level {q.difficulty}</span>
                      <button
                        onClick={() => handleDeleteQuestion(q.id, q.text)}
                        disabled={deleting === q.id}
                        className="text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                      >
                        {deleting === q.id ? "..." : "Delete"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
