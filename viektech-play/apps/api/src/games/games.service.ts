import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGameModeDto } from './dto/create-game-mode.dto';
import { CreateGameSessionDto } from './dto/create-game-session.dto';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

  async createGameMode(data: CreateGameModeDto) {
    return this.prisma.gameMode.create({ data });
  }

  async getGameModes() {
    return this.prisma.gameMode.findMany();
  }

  async createGameSession(data: CreateGameSessionDto) {
    return this.prisma.gameSession.create({
      data: {
        gameModeId: data.gameModeId,
        categoryId: data.categoryId,
        maxParticipants: data.maxParticipants,
        status: 'PENDING',
      },
    });
  }

  async joinGameSession(sessionId: string, userId: string) {
    const session = await this.prisma.gameSession.findUnique({
      where: { id: sessionId },
      include: { participants: true },
    });

    if (!session) {
      throw new NotFoundException('Game session not found');
    }

    if (session.status !== 'PENDING') {
      throw new Error('Game session is not pending');
    }

    if (session.participants.length >= session.maxParticipants) {
      throw new Error('Game session is full');
    }

    const existingParticipant = session.participants.find((p) => p.userId === userId);
    if (existingParticipant) {
      return existingParticipant; // Already joined
    }

    return this.prisma.gameSessionParticipant.create({
      data: {
        gameSessionId: sessionId,
        userId: userId,
      },
    });
  }

  async getActiveSessions() {
    return this.prisma.gameSession.findMany({
      where: { status: { in: ['PENDING', 'IN_PROGRESS'] } },
      include: { gameMode: true, category: true, participants: true },
    });
  }
}
