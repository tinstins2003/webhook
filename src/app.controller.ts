import { AppService } from './app.service';
import { Controller, Get, Post } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  create() {
    return 'create';
  }
  @Get('webhooks')
  getAll() {
    return 'getAll';
  }
  
  @Get('webhooks/:id')
  getById() {
    return 'getById';
  }
}
