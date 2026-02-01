import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  const mockAppService = {
    create: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should return id and message and call service.create', () => {
      const dto = { source: 'stripe', event: 'payment', payload: { amount: 100 } };
      const result = { id: 'uuid-1', message: 'Webhook received' };
      mockAppService.create.mockReturnValue(result);

      expect(appController.create(dto)).toEqual(result);
      expect(appService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('getAll', () => {
    it('should return webhooks and count and call service.getAll', () => {
      const result = { webhooks: [], count: 0 };
      mockAppService.getAll.mockReturnValue(result);

      expect(appController.getAll()).toEqual(result);
      expect(appService.getAll).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should return webhook when found', () => {
      const webhook = {
        id: 'uuid-1',
        source: 'stripe',
        event: 'payment',
        payload: {},
        receivedAt: new Date(),
      };
      mockAppService.getById.mockReturnValue(webhook);

      expect(appController.getById('uuid-1')).toEqual(webhook);
      expect(appService.getById).toHaveBeenCalledWith('uuid-1');
    });

    it('should throw NotFoundException when not found', () => {
      mockAppService.getById.mockImplementation(() => {
        throw new NotFoundException('Webhook not found');
      });

      expect(() => appController.getById('non-existent')).toThrow(
        NotFoundException,
      );
      expect(appService.getById).toHaveBeenCalledWith('non-existent');
    });
  });

  describe('update', () => {
    it('should return updated webhook and call service.update', () => {
      const dto = { event: 'payment.updated' };
      const webhook = {
        id: 'uuid-1',
        source: 'stripe',
        event: 'payment.updated',
        payload: {},
        receivedAt: new Date(),
      };
      mockAppService.update.mockReturnValue(webhook);

      expect(appController.update('uuid-1', dto)).toEqual(webhook);
      expect(appService.update).toHaveBeenCalledWith('uuid-1', dto);
    });

    it('should throw NotFoundException when webhook not found', () => {
      mockAppService.update.mockImplementation(() => {
        throw new NotFoundException('Webhook not found');
      });

      expect(() =>
        appController.update('non-existent', { source: 'x' }),
      ).toThrow(NotFoundException);
      expect(appService.update).toHaveBeenCalledWith('non-existent', {
        source: 'x',
      });
    });
  });
});
