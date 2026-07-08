import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { CreateQuestionDto } from "./dto/create-question.dto";

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
      throw new BadRequestException(
        "A question must have exactly one correct option.",
      );
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
    const questions = await this.prisma.question.findMany({
      where: { categoryId: id },
      select: { id: true },
    });
    const questionIds = questions.map((q) => q.id);

    if (questionIds.length > 0) {
      await this.prisma.questionOption.deleteMany({
        where: { questionId: { in: questionIds } },
      });
      await this.prisma.gameSessionAnswer.deleteMany({
        where: { questionId: { in: questionIds } },
      });
      await this.prisma.gameSessionQuestion.deleteMany({
        where: { questionId: { in: questionIds } },
      });
      await this.prisma.question.deleteMany({
        where: { id: { in: questionIds } },
      });
    }

    return this.prisma.category.delete({ where: { id } });
  }

  async updateQuestion(id: string, updateQuestionDto: any) {
    // If options are provided, we delete existing and recreate
    // A more robust approach would be to upsert, but recreate is simpler for now
    if (updateQuestionDto.options) {
      const correctOptions = updateQuestionDto.options.filter(
        (o) => o.isCorrect,
      );
      if (correctOptions.length !== 1) {
        throw new BadRequestException(
          "A question must have exactly one correct option.",
        );
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
    await this.prisma.questionOption.deleteMany({
      where: { questionId: id },
    });
    await this.prisma.gameSessionAnswer.deleteMany({
      where: { questionId: id },
    });
    await this.prisma.gameSessionQuestion.deleteMany({
      where: { questionId: id },
    });
    return this.prisma.question.delete({
      where: { id },
    });
  }
}
