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

  async updateCategory(id: string, updateCategoryDto: any) {
    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async deleteCategory(id: string) {
    return this.prisma.category.delete({
      where: { id },
    });
  }

  async updateQuestion(id: string, updateQuestionDto: any) {
    // If options are provided, we delete existing and recreate
    // A more robust approach would be to upsert, but recreate is simpler for now
    if (updateQuestionDto.options) {
      const correctOptions = updateQuestionDto.options.filter((o) => o.isCorrect);
      if (correctOptions.length !== 1) {
        throw new BadRequestException('A question must have exactly one correct option.');
      }

      await this.prisma.questionOption.deleteMany({
        where: { questionId: id },
      });
    }

    return this.prisma.question.update({
      where: { id },
      data: {
        text: updateQuestionDto.text,
        categoryId: updateQuestionDto.categoryId,
        difficulty: updateQuestionDto.difficulty,
        ...(updateQuestionDto.options && {
          options: {
            create: updateQuestionDto.options,
          },
        }),
      },
      include: {
        options: true,
      },
    });
  }

  async deleteQuestion(id: string) {
    // Cascade deletion of options is not implicit in Prisma schema unless onDelete: Cascade is defined.
    // Let's explicitly delete options first.
    await this.prisma.questionOption.deleteMany({
      where: { questionId: id },
    });
    return this.prisma.question.delete({
      where: { id },
    });
  }
}