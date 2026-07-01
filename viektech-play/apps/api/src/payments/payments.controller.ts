import { Controller, Post, Body, UseGuards, Request, Headers, HttpCode } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { InitializePaymentDto } from './dto/initialize-payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('initialize')
  initializePayment(@Request() req, @Body() initializePaymentDto: InitializePaymentDto) {
    return this.paymentsService.initializePayment(req.user.userId, initializePaymentDto);
  }

  @Post('webhook')
  @HttpCode(200)
  handleWebhook(
    @Headers('x-paystack-signature') signature: string,
    @Body() body: any,
  ) {
    return this.paymentsService.handleWebhook(signature, body);
  }
}
