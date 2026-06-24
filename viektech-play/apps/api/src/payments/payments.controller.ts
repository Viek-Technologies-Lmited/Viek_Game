import { Controller, Get } from '@nestjs/common';

@Controller('payments')
export class PaymentsController {
  @Get()
  findAll() {
    return { module: 'payments', status: 'ok' };
  }
}