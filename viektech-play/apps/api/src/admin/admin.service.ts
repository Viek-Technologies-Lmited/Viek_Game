import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getPlatformAnalytics() {
    const totalUsers = await this.prisma.user.count();
    const totalOrganizations = await this.prisma.organization.count();
    const totalGameSessions = await this.prisma.gameSession.count();
    
    // Calculate total revenue from successful payments
    const successfulPayments = await this.prisma.payment.aggregate({
      where: { status: 'success' },
      _sum: { amount: true },
    });

    return {
      totalUsers,
      totalOrganizations,
      totalGameSessions,
      totalRevenue: successfulPayments._sum.amount || 0,
    };
  }

  async updateUserRole(userId: string, role: Role) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, email: true, role: true },
    });
  }
}
