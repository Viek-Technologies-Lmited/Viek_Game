const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

interface FetchOptions extends RequestInit {
  token?: string;
}

async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { token, ...fetchOpts } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOpts.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOpts,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  if (res.status === 204) {
    return {} as T;
  }

  return res.json();
}

// ============ Auth API ============
export const authApi = {
  register: (data: { email: string; password: string; displayName: string }) =>
    apiFetch<{
      access_token: string;
      user: import("@viekplay/shared-types").UserProfile;
    }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    apiFetch<{
      access_token: string;
      user: import("@viekplay/shared-types").UserProfile;
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMe: (token: string) =>
    apiFetch<import("@viekplay/shared-types").UserProfile>("/auth/me", {
      token,
    }),
};

// ============ Users API ============
export const usersApi = {
  getAll: (token: string) =>
    apiFetch<import("@viekplay/shared-types").UserProfile[]>("/users", {
      token,
    }),

  getById: (id: string, token: string) =>
    apiFetch<import("@viekplay/shared-types").UserProfile>(`/users/${id}`, {
      token,
    }),

  update: (
    id: string,
    data: import("@viekplay/shared-types").UpdateUserDto,
    token: string,
  ) =>
    apiFetch<import("@viekplay/shared-types").UserProfile>(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      token,
    }),

  delete: (id: string, token: string) =>
    apiFetch<{ message: string }>(`/users/${id}`, { method: "DELETE", token }),
};

// ============ Organizations API ============
export const organizationsApi = {
  create: (
    data: import("@viekplay/shared-types").CreateOrganizationDto,
    token: string,
  ) =>
    apiFetch<import("@viekplay/shared-types").Organization>("/organizations", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  getAll: (token: string) =>
    apiFetch<import("@viekplay/shared-types").Organization[]>(
      "/organizations",
      { token },
    ),

  getById: (id: string, token: string) =>
    apiFetch<import("@viekplay/shared-types").Organization>(
      `/organizations/${id}`,
      { token },
    ),

  update: (
    id: string,
    data: Partial<import("@viekplay/shared-types").CreateOrganizationDto>,
    token: string,
  ) =>
    apiFetch<import("@viekplay/shared-types").Organization>(
      `/organizations/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
        token,
      },
    ),

  delete: (id: string, token: string) =>
    apiFetch<{ message: string }>(`/organizations/${id}`, {
      method: "DELETE",
      token,
    }),
};

// ============ Questions API ============
export const questionsApi = {
  createCategory: (data: { name: string; slug: string }, token: string) =>
    apiFetch<import("@viekplay/shared-types").Category>(
      "/questions/categories",
      {
        method: "POST",
        body: JSON.stringify(data),
        token,
      },
    ),

  getCategories: (token: string) =>
    apiFetch<import("@viekplay/shared-types").Category[]>(
      "/questions/categories",
      { token },
    ),

  deleteCategory: (id: string, token: string) =>
    apiFetch<{ message: string }>(`/questions/categories/${id}`, {
      method: "DELETE",
      token,
    }),

  create: (
    data: {
      text: string;
      categoryId: string;
      difficulty: number;
      options: { text: string; isCorrect: boolean; order: number }[];
    },
    token: string,
  ) =>
    apiFetch<import("@viekplay/shared-types").Question>("/questions", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  getAll: (
    token: string,
    params?: { categoryId?: string; difficulty?: number },
  ) => {
    const query = params
      ? "?" +
        new URLSearchParams(
          Object.entries(params)
            .filter(([_, v]) => v !== undefined)
            .map(([k, v]) => [k, String(v)]),
        ).toString()
      : "";
    return apiFetch<import("@viekplay/shared-types").Question[]>(
      `/questions${query}`,
      { token },
    );
  },

  deleteQuestion: (id: string, token: string) =>
    apiFetch<{ message: string }>(`/questions/${id}`, {
      method: "DELETE",
      token,
    }),
};

// ============ Games API ============
export const gamesApi = {
  createGameMode: (
    data: { name: string; slug: string; timePerQuestionSeconds: number },
    token: string,
  ) =>
    apiFetch<import("@viekplay/shared-types").GameMode>("/games/modes", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  getGameModes: (token: string) =>
    apiFetch<import("@viekplay/shared-types").GameMode[]>("/games/modes", {
      token,
    }),

  deleteGameMode: (id: string, token: string) =>
    apiFetch<{ message: string }>(`/games/modes/${id}`, {
      method: "DELETE",
      token,
    }),

  createSession: (
    data: import("@viekplay/shared-types").CreateGameSessionDto,
    token: string,
  ) =>
    apiFetch<import("@viekplay/shared-types").GameSession>("/games/sessions", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  joinSession: (sessionId: string, token: string) =>
    apiFetch<import("@viekplay/shared-types").GameSessionParticipant>(
      `/games/sessions/${sessionId}/join`,
      {
        method: "POST",
        token,
      },
    ),

  getActiveSessions: (token: string) =>
    apiFetch<import("@viekplay/shared-types").GameSession[]>(
      "/games/sessions/active",
      { token },
    ),

  startSession: (sessionId: string, token: string) =>
    apiFetch<{ started: boolean; totalQuestions: number }>(
      `/games/sessions/${sessionId}/start`,
      {
        method: "POST",
        token,
      },
    ),

  submitAnswer: (
    sessionId: string,
    data: import("@viekplay/shared-types").SubmitAnswerDto,
    token: string,
  ) =>
    apiFetch<import("@viekplay/shared-types").QuizAnswerResult>(
      `/games/sessions/${sessionId}/submit`,
      {
        method: "POST",
        body: JSON.stringify(data),
        token,
      },
    ),
};

// ============ Leaderboard API ============
export const leaderboardApi = {
  getGlobal: (token: string) =>
    apiFetch<import("@viekplay/shared-types").LeaderboardEntry[]>(
      "/leaderboard/global",
      { token },
    ),

  getByOrganization: (organizationId: string, token: string) =>
    apiFetch<import("@viekplay/shared-types").LeaderboardEntry[]>(
      `/leaderboard/organization/${organizationId}`,
      { token },
    ),
};

// ============ Payments API ============
export const paymentsApi = {
  initialize: (
    data: import("@viekplay/shared-types").InitializePaymentDto,
    token: string,
  ) =>
    apiFetch<import("@viekplay/shared-types").PaymentResponse>(
      "/payments/initialize",
      {
        method: "POST",
        body: JSON.stringify(data),
        token,
      },
    ),
};

// ============ Admin API ============
export const adminApi = {
  getStats: (token: string) =>
    apiFetch<import("@viekplay/shared-types").DashboardStats>(
      "/admin/analytics",
      { token },
    ),

  updateUserRole: (
    userId: string,
    role: "PLAYER" | "ADMIN" | "ORG_OWNER",
    token: string,
  ) =>
    apiFetch<import("@viekplay/shared-types").UserProfile>(
      `/admin/users/${userId}/role`,
      {
        method: "PATCH",
        body: JSON.stringify({ role }),
        token,
      },
    ),
};
