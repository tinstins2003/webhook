import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { storage } from '../storage';
import { CreateWebhookDto, UpdateWebhookDto } from '../webhook.dto';
import { Webhook } from '../webhook.interface';

@Injectable()
export class AppService {
  create(dto: CreateWebhookDto): { id: string; message: string } {
    const id = randomUUID();
    const webhook: Webhook = {
      id,
      source: dto.source,
      event: dto.event,
      payload: dto.payload ?? {},
      receivedAt: new Date(),
    };

    storage.save(webhook);

    return {
      id: webhook.id,
      message: 'Webhook received',
    };
  }

  getAll(): { webhooks: Webhook[]; count: number } {
    const webhooks = storage.getAll();

    return {
      webhooks,
      count: webhooks.length,
    };
  }

  getById(id: string): Webhook {
    const webhook = storage.getById(id);
    if (!webhook) {
      throw new NotFoundException('Webhook not found');
    }
    return webhook;
  }

  update(id: string, dto: UpdateWebhookDto): Webhook {
    const webhook = storage.getById(id);
    if (!webhook) {
      throw new NotFoundException('Webhook not found');
    }
    const updated: Webhook = {
      ...webhook,
      ...(dto.source !== undefined && { source: dto.source }),
      ...(dto.event !== undefined && { event: dto.event }),
      ...(dto.payload !== undefined && { payload: dto.payload }),
    };
    storage.update(updated);
    return updated;
  }
}
