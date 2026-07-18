import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
@WebSocketGateway({
  cors: {
    origin: "*",
  },
  transports: ["polling", "websocket"],
})
export class GatewayGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  afterInit(server: Server) {
    console.log("WebSocket gateway initialized with JWT authentication");

    // Add connection middleware for JWT validation
    server.use((socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new UnauthorizedException("No token provided"));
        }

        const jwtSecret = this.configService.get<string>("JWT_SECRET");
        const decoded = this.jwtService.verify(token, { secret: jwtSecret });

        // Attach user info to socket
        socket.data.userId = decoded.sub;
        socket.data.email = decoded.email;
        socket.data.role = decoded.role;

        next();
      } catch (err) {
        next(new UnauthorizedException("Invalid token"));
      }
    });
  }

  handleConnection(client: Socket) {
    console.log(
      `Authenticated user ${client.data.userId} connected: ${client.id}`,
    );
  }

  handleDisconnect(client: Socket) {
    console.log(`User ${client.data.userId} disconnected: ${client.id}`);
  }

  @SubscribeMessage("joinGame")
  async handleJoinGame(
    @MessageBody() data: { sessionId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    // Validate that the user matches the authenticated socket
    if (client.data.userId !== data.userId) {
      throw new UnauthorizedException("User ID mismatch");
    }

    client.join(data.sessionId);
    console.log(`User ${data.userId} joined room ${data.sessionId}`);

    // Fetch user info for the broadcast
    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
      select: { id: true, displayName: true },
    });

    // Notify others in the room
    client.to(data.sessionId).emit("userJoined", {
      userId: data.userId,
      displayName: user?.displayName,
    });

    return { event: "joined", room: data.sessionId };
  }

  @SubscribeMessage("leaveGame")
  handleLeaveGame(
    @MessageBody() data: { sessionId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    // Validate that the user matches the authenticated socket
    if (client.data.userId !== data.userId) {
      throw new UnauthorizedException("User ID mismatch");
    }

    client.leave(data.sessionId);
    client.to(data.sessionId).emit("userLeft", { userId: data.userId });
    return { event: "left", room: data.sessionId };
  }

  @SubscribeMessage("submitAnswer")
  async handleSubmitAnswer(
    @MessageBody()
    data: {
      sessionId: string;
      userId: string;
      questionId: string;
      optionId: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    // Validate that the user matches the authenticated socket
    if (client.data.userId !== data.userId) {
      throw new UnauthorizedException("User ID mismatch");
    }

    // 1. Validate option and score
    const option = await this.prisma.questionOption.findUnique({
      where: { id: data.optionId },
    });

    const isCorrect = option?.isCorrect || false;

    // 2. Record answer
    await this.prisma.gameSessionAnswer.create({
      data: {
        gameSessionId: data.sessionId,
        userId: data.userId,
        questionId: data.questionId,
        selectedOptionId: data.optionId,
        isCorrect: isCorrect,
      },
    });

    // 3. Update score if correct
    if (isCorrect) {
      await this.prisma.gameSessionParticipant.updateMany({
        where: { gameSessionId: data.sessionId, userId: data.userId },
        data: {
          score: { increment: 10 },
        },
      });

      // Update global user score
      await this.prisma.user.update({
        where: { id: data.userId },
        data: { totalScore: { increment: 10 } },
      });
    }

    return { event: "answerReceived", isCorrect };
  }

  // Called by GamesService or Admin to progress the game
  broadcastNextQuestion(sessionId: string, questionPayload: any) {
    this.server.to(sessionId).emit("nextQuestion", questionPayload);
  }

  broadcastGameEnd(sessionId: string, results: any) {
    this.server.to(sessionId).emit("gameEnded", results);
  }
}
