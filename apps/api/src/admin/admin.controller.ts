import { Controller, Get } from '@nestjs/common';

@Controller('admin')
export class AdminController {
  @Get()
  findAll() {
    return { module: 'admin', status: 'ok' };
  }
}