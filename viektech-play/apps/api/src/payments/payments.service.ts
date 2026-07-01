import { Injectable, InternalServerErrorException, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { InitializePaymentDto } from './dto/initialize-payment.dto';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly paystackSecretKey: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.paystackSecretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY') || 'sk_test_mock';
  }

  async initializePayment(userId: string, dto: InitializePaymentDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');

    const reference = \`viek_\${Date.now()}_\${Math.floor(Math.random() * 1000)}\`;

    // 1. Record pending payment in DB
    const payment = await this.prisma.payment.create({
      data: {
        userId,
        amount: dto.amount,
        reference,
        status: 'pending',
      },
    });

    // 2. Call Paystack API
    try {
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: \`Bearer \${this.paystackSecretKey}\`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          amount: dto.amount * 100, // Paystack expects kobo (amount * 100)
          reference: reference,
          callback_url: 'http://localhost:3000/payment-success', // Update based on frontend URL
        }),
      });

      const data = await response.json();

      if (!data.status) {
        throw new Error(data.message);
      }

      return {
        paymentId: payment.id,
        authorizationUrl: data.data.authorization_url,
        reference: data.data.reference,
      };
    } catch (error) {
      this.logger.error('Paystack init failed', error);
      // In a real environment we might want to fail gracefully or retry
      if (this.paystackSecretKey === 'sk_test_mock') {
        this.logger.warn('MOCKING PAYSTACK RESPONSE (No secret key)');
        return {
          paymentId: payment.id,
          authorizationUrl: \`https://mock.paystack.com/checkout/\${reference}\`,
          reference,
        };
      }
      throw new InternalServerErrorException('Payment initialization failed');
    }
  }

  async handleWebhook(signature: string, body: any) {
    const hash = crypto
      .createHmac('sha512', this.paystackSecretKey)
      .update(JSON.stringify(body))
      .digest('hex');

    if (hash !== signature) {
      this.logger.error('Invalid signature for webhook');
      throw new BadRequestException('Invalid signature');
    }

    const event = body.event;
    const data = body.data;

    if (event === 'charge.success') {
      await this.verifyAndFulfillPayment(data.reference, data.amount);
    }

    return { status: 'success' };
  }

  async verifyAndFulfillPayment(reference: string, amountPaidInKobo: number) {
    const payment = await this.prisma.payment.findUnique({ where: { reference } });
    if (!payment || payment.status === 'success') return;

    // Verify amount matches (convert DB amount back to kobo or vice versa)
    if (payment.amount * 100 !== amountPaidInKobo) {
      this.logger.warn(\`Amount mismatch for ref \${reference}\`);
    }

    // Mark payment as success
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'success' },
    });

    // Handle Subscription Logic (e.g. give user pro status)
    // Here we can simply add a Subscription record
    await this.prisma.subscription.create({
      data: {
        userId: payment.userId,
        plan: 'PRO',
        status: 'active',
        endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
      },
    });

    this.logger.log(\`Payment \${reference} fulfilled\`);
  }
}
