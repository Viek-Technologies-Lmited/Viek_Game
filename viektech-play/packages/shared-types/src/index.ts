// ============ Auth Types ============
export interface RegisterDto {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: UserProfile;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: 'PLAYER' | 'ADMIN' | 'ORG_OWNER';
  totalScore?: number;
  gamesPlayed?: number;
  organizationId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserDto {
  displayName?: string;
  email?: string;
}

// ============ Organization Types ============
export interface Organization {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrganizationDto {
  name: string;
  slug: string;
}

// ============ Question Types ============
export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionOption {
  id: string;
  questionId: string;
  text: string;
  isCorrect: boolean;
  order: number;
}

export interface Question {
  id: string;
  text: string;
  categoryId: string;
  difficulty: number;
  createdAt: string;
  updatedAt: string;
  options: QuestionOption[];
  category?: Category;
}

export interface CreateCategoryDto {
  name: string;
  slug?: string;
}

export interface CreateQuestionDto {
  categoryId: string;
  text: string;
  difficulty?: number;
  options: { text: string; isCorrect: boolean; order: number }[];
}

// ============ Game Types ============
export interface GameMode {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface GameSession {
  id: string;
  gameModeId: string;
  categoryId: string | null;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  maxParticipants: number;
  currentQuestionId: string | null;
  startedAt: string | null;
  endedAt: string | null;
  createdAt: string;
  updatedAt: string;
  gameMode?: GameMode;
  category?: Category;
  participants?: GameSessionParticipant[];
}

export interface GameSessionParticipant {
  id: string;
  gameSessionId: string;
  userId: string;
  score: number;
  joinedAt: string;
  user?: UserProfile;
}

export interface CreateGameModeDto {
  name: string;
  slug?: string;
}

export interface CreateGameSessionDto {
  gameModeId: string;
  categoryId?: string;
  maxParticipants?: number;
}

export interface SubmitAnswerDto {
  questionId: string;
  optionId: string;
}

export interface QuizAnswerResult {
  correct: boolean;
  pointsEarned: number;
  currentScore: number;
}

// ============ WebSocket Event Types ============
export interface WsJoinGamePayload {
  sessionId: string;
  userId: string;
}

export interface WsSubmitAnswerPayload {
  sessionId: string;
  userId: string;
  questionId: string;
  optionId: string;
}

export interface WsNextQuestionEvent {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  timeLimit: number;
}

export interface WsGameEndedEvent {
  sessionId: string;
  results: {
    userId: string;
    displayName: string;
    score: number;
    rank: number;
  }[];
}

export interface WsUserJoinedEvent {
  userId: string;
  displayName?: string;
}

// ============ Leaderboard Types ============
export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  score: number;
  gamesPlayed: number;
  rank?: number;
}

// ============ Payment Types ============
export interface InitializePaymentDto {
  amount: number;
  plan?: string;
}

export interface PaymentResponse {
  paymentId: string;
  authorizationUrl: string;
  reference: string;
}

// ============ Dashboard Stats Types ============
export interface DashboardStats {
  module: string;
  status: string;
  totalUsers?: number;
  totalGames?: number;
  totalQuestions?: number;
}

// ============ Generic Types ============
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export interface HealthCheckResponse {
  status: 'ok';
  service: string;
}