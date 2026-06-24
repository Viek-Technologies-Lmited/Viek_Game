import { Controller, Get } from '@nestjs/common';

@Controller('leaderboard')
export class LeaderboardController {
  @Get()
  findAll() {
    return { module: 'leaderboard', status: 'ok' };
  }
}