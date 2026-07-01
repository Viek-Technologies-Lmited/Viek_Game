import { Controller, Get, Param, Query } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('global')
  getGlobalLeaderboard(@Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    return this.leaderboardService.getGlobalLeaderboard(parsedLimit);
  }

  @Get('session/:sessionId')
  getSessionLeaderboard(@Param('sessionId') sessionId: string) {
    return this.leaderboardService.getSessionLeaderboard(sessionId);
  }

  @Get('achievements')
  getAchievements() {
    return this.leaderboardService.getAchievements();
  }
}
