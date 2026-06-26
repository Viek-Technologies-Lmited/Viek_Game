import { Controller, Get } from '@nestjs/common';

@Controller('organizations')
export class OrganizationsController {
  @Get()
  findAll() {
    return { module: 'organizations', status: 'ok' };
  }
}