import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { QuestionsModule } from './questions/questions.module';
import { GamesModule } from './games/games.module';
import { GatewayModule } from './gateway/gateway.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { PaymentsModule } from './payments/payments.module';
import { AdminModule } from './admin/admin.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    OrganizationsModule,
    QuestionsModule,
    GamesModule,
    GatewayModule,
    LeaderboardModule,
    PaymentsModule,
    AdminModule,
  ],
})
export class AppModule {}