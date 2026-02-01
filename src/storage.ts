import { Webhook } from './webhook.interface';

let webhooks: Webhook[] = [];

export const storage = {
  save(webhook: Webhook): void {
    webhooks.push(webhook);
  },

  getAll(): Webhook[] {
    return webhooks;
  },

  getById(id: string): Webhook | undefined {
    return webhooks.find((w) => w.id === id);
  },

  update(webhook: Webhook): void {
    const index = webhooks.findIndex((w) => w.id === webhook.id);
    if (index !== -1) {
      webhooks[index] = webhook;
    }
  },

  count(): number {
    return webhooks.length;
  },

  clear(): void {
    webhooks = [];
  },
};
