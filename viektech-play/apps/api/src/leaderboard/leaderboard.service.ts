import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LeaderboardService {
  constructor(private prisma: PrismaService) {}

  async getGlobalLeaderboard(limit: number = 10) {
    return this.prisma.user.findMany({
      orderBy: { totalScore: 'desc' },
      take: limit,
      select: {
        id: true,
        displayName: true,
        totalScore: true,
        gamesPlayed: true,
      },
    });
  }

  async getSessionLeaderboard(sessionId: string) {
    return this.prisma.gameSessionParticipant.findMany({
      where: { gameSessionId: sessionId },
      orderBy: { score: 'desc' },
      include: {
        user: {
          select: { id: true, displayName: true },
        },
      },
    });
  }

  async unlockAchievement(userId: string, achievementName: string) {
    // Find the achievement by name (or slug if it had one)
    const achievement = await this.prisma.achievement.findFirst({
      where: { name: achievementName },
    });

    if (!achievement) return null; // Achievement doesn't exist in DB

    // Check if already unlocked
    const existing = await this.prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId,
          achievementId: achievement.id,
        },
      },
    });

    if (existing) return existing; // Already unlocked

    // Unlock it
    return this.prisma.userAchievement.create({
      data: {
        userId,
        achievementId: achievement.id,
      },
    });
  }

  async getAchievements() {
    return this.prisma.achievement.findMany();
  }
}
