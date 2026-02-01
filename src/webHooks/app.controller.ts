import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateWebhookDto, UpdateWebhookDto } from '../webhook.dto';
import { AppService } from './app.service';

@Controller('webhooks')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post()
  create(@Body() dto: CreateWebhookDto) {
    return this.appService.create(dto);
  }

  @Get('')
  getAll() {
    return this.appService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.appService.getById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWebhookDto) {
    return this.appService.update(id, dto);
  }
}
