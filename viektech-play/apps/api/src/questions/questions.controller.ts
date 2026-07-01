import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get('categories')
  findAllCategories() {
    return this.questionsService.findAllCategories();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('categories')
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.questionsService.createCategory(createCategoryDto);
  }

  @Get()
  findQuestions(@Query('categoryId') categoryId: string) {
    if (!categoryId) {
      return [];
    }
    return this.questionsService.findQuestionsByCategory(categoryId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.createQuestion(createQuestionDto);
  }
}