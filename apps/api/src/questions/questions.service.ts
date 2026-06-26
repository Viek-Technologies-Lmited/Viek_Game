import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateQuestionDto } from './dto/create-question.dto';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  async findAllCategories() {
    return this.prisma.category.findMany();
  }

  async createQuestion(createQuestionDto: CreateQuestionDto) {
    const correctOptions = createQuestionDto.options.filter((o) => o.isCorrect);
    if (correctOptions.length !== 1) {
      throw new BadRequestException('A question must have exactly one correct option.');
    }

    return this.prisma.question.create({
      data: {
        text: createQuestionDto.text,
        categoryId: createQuestionDto.categoryId,
        difficulty: createQuestionDto.difficulty,
        options: {
          create: createQuestionDto.options,
        },
      },
      include: {
        options: true,
      },
    });
  }

  async findQuestionsByCategory(categoryId: string) {
    return this.prisma.question.findMany({
      where: { categoryId },
      include: {
        options: {
          select: { id: true, text: true, isCorrect: false, order: true },
        },
      },
    });
  }
}