import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateGameModeDto } from "./dto/create-game-mode.dto";
import { CreateGameSessionDto } from "./dto/create-game-session.dto";
import { GatewayGateway } from "../gateway/gateway.gateway";

const QUESTIONS_PER_GAME = 20;

@Injectable()
export class GamesService {
  private activeTimers = new Map<string, NodeJS.Timeout>();

  constructor(
    private prisma: PrismaService,
    private gateway: GatewayGateway,
  ) {}

  async createGameMode(data: CreateGameModeDto) {
    return this.prisma.gameMode.create({ data });
  }

  async getGameModes() {
    return this.prisma.gameMode.findMany();
  }

  async deleteGameMode(id: string) {
    return this.prisma.gameMode.delete({ where: { id } });
  }

  async createGameSession(data: CreateGameSessionDto) {
    return this.prisma.gameSession.create({
      data: {
        gameModeId: data.gameModeId,
        categoryId: data.categoryId,
        maxParticipants: data.maxParticipants,
        status: "PENDING",
      },
    });
  }

  async joinGameSession(sessionId: string, userId: string) {
    const session = await this.prisma.gameSession.findUnique({
      where: { id: sessionId },
      include: { participants: true },
    });
    if (!session) throw new NotFoundException("Game session not found");
    if (session.status !== "PENDING")
      throw new BadRequestException("Game session is not pending");
    if (session.participants.length >= session.maxParticipants) {
      throw new BadRequestException("Game session is full");
    }
    const existing = session.participants.find((p) => p.userId === userId);
    if (existing) return existing;

    return this.prisma.gameSessionParticipant.create({
      data: { gameSessionId: sessionId, userId },
    });
  }

  async getActiveSessions() {
    return this.prisma.gameSession.findMany({
      where: { status: { in: ["PENDING", "IN_PROGRESS"] } },
      include: { gameMode: true, category: true, participants: true },
    });
  }

  async startGame(sessionId: string) {
    const session = await this.prisma.gameSession.findUnique({
      where: { id: sessionId },
      include: { gameMode: true },
    });
    if (!session) throw new NotFoundException("Game session not found");
    if (session.status !== "PENDING") {
      throw new BadRequestException("Game has already started or ended");
    }

    const questions = await this.prisma.question.findMany({
      where: session.categoryId
        ? { categoryId: session.categoryId }
        : undefined,
      include: { options: true },
      take: QUESTIONS_PER_GAME,
    });

    if (questions.length === 0) {
      throw new BadRequestException(
        "No questions available for this category yet",
      );
    }

    await this.prisma.gameSessionQuestion.createMany({
      data: questions.map((q, index) => ({
        gameSessionId: sessionId,
        questionId: q.id,
        order: index,
      })),
    });

    await this.prisma.gameSession.update({
      where: { id: sessionId },
      data: { status: "IN_PROGRESS", startedAt: new Date() },
    });

    this.advanceQuestion(
      sessionId,
      0,
      questions,
      session.gameMode.timePerQuestionSeconds,
    );

    return { started: true, totalQuestions: questions.length };
  }

  private advanceQuestion(
    sessionId: string,
    index: number,
    questions: Array<{
      id: string;
      text: string;
      options: Array<{
        id: string;
        text: string;
        isCorrect: boolean;
        order: number;
      }>;
    }>,
    timePerQuestionSeconds: number,
  ) {
    const existingTimer = this.activeTimers.get(sessionId);
    if (existingTimer) clearTimeout(existingTimer);

    if (index >= questions.length) {
      this.endGame(sessionId);
      return;
    }

    const question = questions[index];

    this.prisma.gameSession
      .update({
        where: { id: sessionId },
        data: { currentQuestionId: question.id },
      })
      .catch(() => {});

    const payload = {
      question: {
        id: question.id,
        text: question.text,
        options: [...question.options]
          .sort((a, b) => a.order - b.order)
          .map((o) => ({
            id: o.id,
            text: o.text,
            isCorrect: o.isCorrect,
            order: o.order,
          })),
      },
      questionNumber: index + 1,
      totalQuestions: questions.length,
      timeLimit: timePerQuestionSeconds,
    };

    this.gateway.broadcastNextQuestion(sessionId, payload);

    const timer = setTimeout(() => {
      this.advanceQuestion(
        sessionId,
        index + 1,
        questions,
        timePerQuestionSeconds,
      );
    }, timePerQuestionSeconds * 1000);

    this.activeTimers.set(sessionId, timer);
  }

  private async endGame(sessionId: string) {
    this.activeTimers.delete(sessionId);

    await this.prisma.gameSession.update({
      where: { id: sessionId },
      data: {
        status: "COMPLETED",
        endedAt: new Date(),
        currentQuestionId: null,
      },
    });

    const participants = await this.prisma.gameSessionParticipant.findMany({
      where: { gameSessionId: sessionId },
      include: { user: { select: { displayName: true } } },
      orderBy: { score: "desc" },
    });

    const results = participants.map((p, i) => ({
      userId: p.userId,
      displayName: p.user.displayName,
      score: p.score,
      rank: i + 1,
    }));

    this.gateway.broadcastGameEnd(sessionId, results);
  }
}
