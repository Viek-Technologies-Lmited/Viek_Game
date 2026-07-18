"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth-context";
import { usersApi, adminApi } from "../../lib/api-client";
import type { UserProfile } from "@viekplay/shared-types";

const ROLE_OPTIONS = [
  { value: "PLAYER", label: "Player" },
  { value: "ADMIN", label: "Admin" },
  { value: "ORG_OWNER", label: "Organization Owner" },
];

export default function UsersPage() {
  const router = useRouter();
  const { token, isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<
    "PLAYER" | "ADMIN" | "ORG_OWNER"
  >("PLAYER");
  const [savingRole, setSavingRole] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      router.push("/login");
      return;
    }
    if (!token) return;
    loadUsers();
  }, [token, authLoading]);

  const loadUsers = async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const data = await usersApi.getAll(token);
      setUsers(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (
    userId: string,
    newRole: "PLAYER" | "ADMIN" | "ORG_OWNER",
  ) => {
    if (!token) return;
    setSavingRole(true);
    setError("");
    try {
      await adminApi.updateUserRole(userId, newRole, token);
      setSuccess("User role updated successfully");
      setTimeout(() => setSuccess(""), 3000);
      setEditingUserId(null);
      loadUsers(); // Refresh list
    } catch (err: any) {
      setError(err.message || "Failed to update user role");
    } finally {
      setSavingRole(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete user "${userName}"? This action cannot be undone.`,
      )
    ) {
      return;
    }
    if (!token) return;
    setDeleting(userId);
    setError("");
    try {
      await usersApi.delete(userId, token);
      setSuccess("User deleted successfully");
      setTimeout(() => setSuccess(""), 3000);
      setUsers(users.filter((u) => u.id !== userId));
    } catch (err: any) {
      setError(err.message || "Failed to delete user");
    } finally {
      setDeleting(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user.email.toLowerCase().includes(term) ||
      user.displayName.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gray-50 p-6">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage all users, assign roles, and handle permissions
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-4 rounded-lg bg-green-50 p-4 text-sm text-green-700 border border-green-200">
            {success}
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6 flex gap-4">
          <input
            type="text"
            placeholder="Search by email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={loadUsers}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Score
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Games
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Joined
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    {users.length === 0
                      ? "No users found"
                      : "No results matching your search"}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {user.displayName || "Unnamed User"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      {editingUserId === user.id ? (
                        <select
                          value={editingRole}
                          onChange={(e) =>
                            setEditingRole(e.target.value as any)
                          }
                          className="rounded border border-gray-300 px-2 py-1 text-sm"
                        >
                          {ROLE_OPTIONS.map((role) => (
                            <option key={role.value} value={role.value}>
                              {role.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            user.role === "ADMIN"
                              ? "bg-purple-100 text-purple-800"
                              : user.role === "ORG_OWNER"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.totalScore || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.gamesPlayed || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {editingUserId === user.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleRoleChange(user.id, editingRole)
                            }
                            disabled={savingRole}
                            className="rounded bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                          >
                            {savingRole ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={() => setEditingUserId(null)}
                            className="rounded bg-gray-300 px-2 py-1 text-xs font-medium text-gray-800 hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingUserId(user.id);
                              setEditingRole(user.role);
                            }}
                            className="rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700"
                          >
                            Edit Role
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteUser(
                                user.id,
                                user.displayName || user.email,
                              )
                            }
                            disabled={deleting === user.id}
                            className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                          >
                            {deleting === user.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {users.length}
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Admins</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {users.filter((u) => u.role === "ADMIN").length}
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Players</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {users.filter((u) => u.role === "PLAYER").length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
