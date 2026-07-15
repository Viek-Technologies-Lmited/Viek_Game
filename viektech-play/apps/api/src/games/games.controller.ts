import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from "@nestjs/common";
import { GamesService } from "./games.service";
import { CreateGameModeDto } from "./dto/create-game-mode.dto";
import { CreateGameSessionDto } from "./dto/create-game-session.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { Role } from "@prisma/client";

@Controller("games")
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get("modes")
  getGameModes() {
    return this.gamesService.getGameModes();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post("modes")
  createGameMode(@Body() createGameModeDto: CreateGameModeDto) {
    return this.gamesService.createGameMode(createGameModeDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete("modes/:id")
  deleteGameMode(@Param("id") id: string) {
    return this.gamesService.deleteGameMode(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post("sessions/:id/start")
  startGame(@Param("id") id: string) {
    return this.gamesService.startGame(id);
  }

  @Get("sessions/active")
  getActiveSessions() {
    return this.gamesService.getActiveSessions();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post("sessions")
  createGameSession(@Body() createGameSessionDto: CreateGameSessionDto) {
    return this.gamesService.createGameSession(createGameSessionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("sessions/:id/join")
  joinGameSession(@Param("id") id: string, @Request() req) {
    return this.gamesService.joinGameSession(id, req.user.userId);
  }
}
