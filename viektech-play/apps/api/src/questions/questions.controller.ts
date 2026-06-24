import { Controller, Get } from '@nestjs/common';

@Controller('questions')
export class QuestionsController {
  @Get()
  findAll() {
    return { module: 'questions', status: 'ok' };
  }
}