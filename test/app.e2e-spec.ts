import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { ErrorHandlerInterceptor } from '../src/common/error-handler.interceptor';
import { AppModule } from '../src/webHooks/app.module';

const E2E_API_KEY = 'e2e-test-api-key';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    process.env.X_API_KEY = E2E_API_KEY;
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useGlobalInterceptors(new ErrorHandlerInterceptor());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  const withApiKey = (req: request.Test) => req.set('x-api-key', E2E_API_KEY);

  it('POST /webhooks - creates webhook and returns id and message', () => {
    return withApiKey(
      request(app.getHttpServer()).post('/webhooks').send({
        source: 'stripe',
        event: 'payment.created',
        payload: { amount: 100 },
      }),
    )
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('message', 'Webhook received');
      });
  });

  it('GET /webhooks - returns webhooks array and count', () => {
    return withApiKey(request(app.getHttpServer()).get('/webhooks'))
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('webhooks');
        expect(res.body).toHaveProperty('count');
        expect(Array.isArray(res.body.webhooks)).toBe(true);
      });
  });

  it('GET /webhooks/:id - returns webhook when found', async () => {
    const createRes = await withApiKey(
      request(app.getHttpServer())
        .post('/webhooks')
        .send({ source: 'test', event: 'test.event', payload: {} }),
    );
    const { id } = createRes.body;

    return withApiKey(request(app.getHttpServer()).get(`/webhooks/${id}`))
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(id);
        expect(res.body.source).toBe('test');
        expect(res.body.event).toBe('test.event');
        expect(res.body).toHaveProperty('receivedAt');
      });
  });

  it('GET /webhooks/:id - returns 404 when not found', () => {
    return withApiKey(
      request(app.getHttpServer()).get('/webhooks/non-existent-id'),
    ).expect(404);
  });

  it('PATCH /webhooks/:id - returns updated webhook when found', async () => {
    const createRes = await withApiKey(
      request(app.getHttpServer())
        .post('/webhooks')
        .send({ source: 'stripe', event: 'payment.created', payload: {} }),
    );
    const { id } = createRes.body;

    return withApiKey(
      request(app.getHttpServer())
        .patch(`/webhooks/${id}`)
        .send({ event: 'payment.updated', payload: { amount: 200 } }),
    )
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(id);
        expect(res.body.source).toBe('stripe');
        expect(res.body.event).toBe('payment.updated');
        expect(res.body.payload).toEqual({ amount: 200 });
        expect(res.body).toHaveProperty('receivedAt');
      });
  });

  it('PATCH /webhooks/:id - returns 404 when not found', () => {
    return withApiKey(
      request(app.getHttpServer())
        .patch('/webhooks/non-existent-id')
        .send({ event: 'updated' }),
    ).expect(404);
  });

  it('returns 401 when x-api-key is missing', () => {
    return request(app.getHttpServer())
      .post('/webhooks')
      .send({ source: 's', event: 'e', payload: {} })
      .expect(401);
  });
});
