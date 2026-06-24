import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Get()
  findAll() {
    return { module: 'auth', status: 'ok' };
  }
}
