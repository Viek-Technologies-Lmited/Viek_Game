import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['polling', 'websocket'], // Ensure polling fallbacks
})
export class GatewayGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private prisma: PrismaService) {}

  afterInit(server: Server) {
    console.log('WebSocket gateway initialized with polling & websocket transports');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinGame')
  async handleJoinGame(
    @MessageBody() data: { sessionId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.sessionId);
    console.log(`User ${data.userId} joined room ${data.sessionId}`);
    
    // Notify others in the room
    client.to(data.sessionId).emit('userJoined', { userId: data.userId });
    
    return { event: 'joined', room: data.sessionId };
  }

  @SubscribeMessage('leaveGame')
  handleLeaveGame(
    @MessageBody() data: { sessionId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(data.sessionId);
    client.to(data.sessionId).emit('userLeft', { userId: data.userId });
    return { event: 'left', room: data.sessionId };
  }

  @SubscribeMessage('submitAnswer')
  async handleSubmitAnswer(
    @MessageBody() data: { sessionId: string; userId: string; questionId: string; optionId: string },
    @ConnectedSocket() client: Socket,
  ) {
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
          score: { increment: 10 }, // Award 10 points for a correct answer
        },
      });
      
      // Update global user score
      await this.prisma.user.update({
        where: { id: data.userId },
        data: { totalScore: { increment: 10 } },
      });
    }

    return { event: 'answerReceived', isCorrect };
  }

  // Called by GamesService or Admin to progress the game
  broadcastNextQuestion(sessionId: string, questionPayload: any) {
    this.server.to(sessionId).emit('nextQuestion', questionPayload);
  }

  broadcastGameEnd(sessionId: string, results: any) {
    this.server.to(sessionId).emit('gameEnded', results);
  }
}
