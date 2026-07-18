"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth-context";
import { questionsApi } from "../../lib/api-client";
import type { Category } from "@viekplay/shared-types";

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

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function CategoriesPage() {
  const router = useRouter();
  const { token, isAuthenticated, isLoading: authLoading } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [catPreset, setCatPreset] = useState(COMMON_CATEGORIES[0]);
  const [customCatName, setCustomCatName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [creatingCat, setCreatingCat] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!token) return;
    loadCategories();
  }, [token, authLoading]);

  const loadCategories = async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const cats = await questionsApi.getCategories(token);
      setCategories(cats || []);
    } catch (err: any) {
      setError(err.message || "Failed to load categories");
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
    if (!name) {
      setError("Category name is required");
      return;
    }

    if (categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      setError("Category already exists");
      return;
    }

    setCreatingCat(true);
    setError("");
    try {
      await questionsApi.createCategory({ name, slug: slugify(name) }, token);
      setCustomCatName("");
      setCatPreset(COMMON_CATEGORIES[0]);
      await loadCategories();
      flashSuccess(`"${name}" category created`);
    } catch (err: any) {
      setError(err.message || "Failed to create category");
    } finally {
      setCreatingCat(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!token) return;
    if (!confirm(`Delete category "${name}"? This cannot be undone.`)) return;

    setDeleting(id);
    setError("");
    try {
      await questionsApi.deleteCategory(id, token);
      await loadCategories();
      flashSuccess(`"${name}" deleted`);
    } catch (err: any) {
      setError(err.message || "Failed to delete category");
    } finally {
      setDeleting(null);
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
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
        <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
        <p className="text-gray-600 mt-1">Create and manage quiz categories</p>
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
        {/* Create Category */}
        <div className="lg:col-span-1 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold mb-4 text-gray-800">Add Category</h2>

          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select or custom
              </label>
              <select
                value={catPreset}
                onChange={(e) => setCatPreset(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {COMMON_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {catPreset === "Custom..." && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category name
                </label>
                <input
                  type="text"
                  value={customCatName}
                  onChange={(e) => setCustomCatName(e.target.value)}
                  placeholder="e.g., Arts & Culture"
                  required={catPreset === "Custom..."}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={creatingCat}
              className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
            >
              {creatingCat ? "Creating..." : "+ Create"}
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold mb-4 text-gray-800">
            Categories ({categories.length})
          </h2>

          {categories.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No categories yet. Create one to get started.
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  {editingId === cat.id ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 px-2 py-1.5 rounded border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className="font-medium text-gray-800 text-sm">
                          {cat.name}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          {cat.slug}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(cat)}
                          className="px-3 py-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id, cat.name)}
                          disabled={deleting === cat.id}
                          className="px-3 py-1.5 text-xs text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                        >
                          {deleting === cat.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
