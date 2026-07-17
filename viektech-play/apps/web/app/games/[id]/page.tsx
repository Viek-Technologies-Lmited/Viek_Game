'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { useSocket } from '../../lib/use-socket';

interface Player {
  userId: string;
  displayName?: string;
  score: number;
}

interface Question {
  id: string;
  text: string;
  options: { id: string; text: string; isCorrect: boolean; order: number }[];
}

export default function GameRoomPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading: authLoading } = useAuth();
  const socket = useSocket(token);

  const [players, setPlayers] = useState<Player[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<'waiting' | 'playing' | 'ended'>('waiting');
  const [results, setResults] = useState<any[]>([]);
  const [countdown, setCountdown] = useState(5);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const sessionId = params.id as string;

  // Join the game room
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      // router.push('/login');
      // return;
    }
    if (!token || !user || !sessionId) return;

    socket.joinGame(sessionId, user.id);

    return () => {
      socket.leaveGame(sessionId, user.id);
    };
  }, [token, user, sessionId, authLoading]);

  // Listen for user joined
  useEffect(() => {
    if (!token) return;
    const cleanup = socket.onUserJoined((data) => {
      setPlayers((prev) => {
        if (prev.find((p) => p.userId === data.userId)) return prev;
        return [...prev, { userId: data.userId, displayName: data.displayName, score: 0 }];
      });
    });
    return cleanup;
  }, [token]);

  // Listen for next question
  useEffect(() => {
    if (!token) return;
    const cleanup = socket.onNextQuestion((data) => {
      setCurrentQuestion(data.question);
      setQuestionNumber(data.questionNumber);
      setTotalQuestions(data.totalQuestions);
      setTimeLeft(data.timeLimit || 30);
      setSelectedOption(null);
      setIsCorrect(null);
      setGameStatus('playing');
    });
    return cleanup;
  }, [token]);

  // Listen for game ended
  useEffect(() => {
    if (!token) return;
    const cleanup = socket.onGameEnded((data) => {
      setGameStatus('ended');
      setResults(data.results || []);
      setCurrentQuestion(null);
    });
    return cleanup;
  }, [token]);

  // Timer countdown
  useEffect(() => {
    if (gameStatus !== 'playing' || timeLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStatus, timeLeft]);

  // Waiting countdown
  useEffect(() => {
    if (gameStatus !== 'waiting') return;
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [gameStatus]);

  // Reset countdown every time it hits 0
  useEffect(() => {
    if (countdown === 0 && gameStatus === 'waiting') {
      setCountdown(5);
    }
  }, [countdown, gameStatus]);

  const handleSelectOption = (optionId: string, correct: boolean) => {
    if (selectedOption || !user) return;
    setSelectedOption(optionId);
    setIsCorrect(correct);
    if (correct) {
      const newScore = score + 10;
      setScore(newScore);
      setPlayers((prev) =>
        prev.map((p) =>
          p.userId === user.id ? { ...p, score: newScore } : p
        )
      );
    }
    // Emit answer via socket
    if (currentQuestion) {
      socket.submitAnswer(sessionId, user.id, currentQuestion.id, optionId);
    }
  };

  // Add the current user to players list
  useEffect(() => {
    if (user && !players.find((p) => p.userId === user.id)) {
      setPlayers((prev) => [
        ...prev,
        { userId: user.id, displayName: user.displayName, score: 0 },
      ]);
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="flex-1 flex items-center justify-center game-gradient">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex-1 game-gradient text-white flex flex-col">
      {/* Waiting Room */}
      {gameStatus === 'waiting' && (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="text-center">
            <div className="relative inline-flex mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl">
                🎮
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-sm font-bold animate-pulse">
                {players.length}
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Waiting for Players</h1>
            <p className="text-white/60 mb-8">Game will start soon...</p>

            {/* Players list */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {players.map((player) => (
                <div
                  key={player.userId}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xs font-bold">
                    {player.displayName?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <span className="text-sm font-medium">{player.displayName || 'Player'}</span>
                </div>
              ))}
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-sm">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Game starting in {countdown}s
            </div>
          </div>
        </div>
      )}

      {/* Active Game */}
      {gameStatus === 'playing' && currentQuestion && (
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4 sm:p-6 lg:p-8">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-full bg-white/10 text-sm">
                Question {questionNumber}/{totalQuestions}
              </div>
              <div className="px-3 py-1 rounded-full bg-white/10 text-sm">
                Score: {score}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${timeLeft > 10 ? 'bg-green-400' : timeLeft > 5 ? 'bg-yellow-400' : 'bg-red-400 animate-pulse'}`} />
              <span className="text-sm font-mono">{timeLeft}s</span>
            </div>
          </div>

          {/* Timer bar */}
          <div className="w-full h-1.5 rounded-full bg-white/10 mb-8 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                timeLeft > 10 ? 'bg-green-500' : timeLeft > 5 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${(timeLeft / 30) * 100}%` }}
            />
          </div>

          {/* Question */}
          <h2 className="text-xl sm:text-2xl font-bold mb-8 animate-fade-in">
            {currentQuestion.text}
          </h2>

          {/* Options */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {currentQuestion.options
              .sort((a, b) => a.order - b.order)
              .map((option) => {
                const isSelected = selectedOption === option.id;
                const showCorrect = selectedOption !== null;
                const borderColor = showCorrect
                  ? option.isCorrect
                    ? 'border-green-500 bg-green-500/20'
                    : isSelected
                    ? 'border-red-500 bg-red-500/20'
                    : 'border-white/10'
                  : isSelected
                  ? 'border-blue-500 bg-blue-500/20'
                  : 'border-white/10 hover:border-white/30';

                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(option.id, option.isCorrect)}
                    disabled={selectedOption !== null}
                    className={`p-4 sm:p-6 rounded-2xl border-2 ${borderColor} bg-white/5 backdrop-blur-sm transition-all text-left ${
                      !selectedOption ? 'hover:bg-white/10 cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        showCorrect && option.isCorrect
                          ? 'bg-green-500 text-white'
                          : isSelected && !option.isCorrect
                          ? 'bg-red-500 text-white'
                          : 'bg-white/10'
                      }`}>
                        {showCorrect && option.isCorrect ? '✓' : String.fromCharCode(65 + option.order)}
                      </div>
                      <span className="text-base sm:text-lg">{option.text}</span>
                    </div>
                  </button>
                );
              })}
          </div>

          {/* Players sidebar */}
          <div className="border-t border-white/10 pt-4">
            <div className="flex gap-4 overflow-x-auto pb-2">
              {players
                .sort((a, b) => b.score - a.score)
                .map((player, i) => (
                  <div
                    key={player.userId}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                      player.userId === user?.id
                        ? 'bg-blue-500/30 border border-blue-400/50'
                        : 'bg-white/10'
                    }`}
                  >
                    <span className="text-xs text-white/50">#{i + 1}</span>
                    <span className="text-sm font-medium">
                      {player.displayName || 'Player'}
                      {player.userId === user?.id && ' (you)'}
                    </span>
                    <span className="text-sm font-bold text-yellow-400">{player.score}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Game Ended */}
      {gameStatus === 'ended' && (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center max-w-2xl w-full">
            <div className="text-6xl mb-4">🏆</div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Game Over!</h1>
            <p className="text-white/60 mb-8">Here are the final results</p>

            <div className="space-y-3 mb-8">
              {results
                .sort((a, b) => a.rank - b.rank)
                .map((result) => (
                  <div
                    key={result.userId}
                    className={`flex items-center justify-between p-4 rounded-xl ${
                      result.rank === 1
                        ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30'
                        : result.rank === 2
                        ? 'bg-gradient-to-r from-zinc-300/20 to-zinc-400/10 border border-zinc-400/30'
                        : result.rank === 3
                        ? 'bg-gradient-to-r from-amber-700/20 to-amber-800/10 border border-amber-700/30'
                        : 'bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        result.rank === 1 ? 'bg-yellow-500 text-black' :
                        result.rank === 2 ? 'bg-zinc-400 text-black' :
                        result.rank === 3 ? 'bg-amber-700 text-white' :
                        'bg-white/10'
                      }`}>
                        {result.rank}
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{result.displayName}</div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-yellow-400">{result.score}</div>
                  </div>
                ))}
            </div>

            <button
              onClick={() => router.push('/games')}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              Back to Lobby
            </button>
          </div>
        </div>
      )}
    </div>
  );
}