import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import * as request from 'supertest';
import { PayloadsController } from 'modules/admin/payloads/payloads.controller';
import { PayloadsService } from 'modules/admin/payloads/payloads.service';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { HttpConfigService } from 'shared/http/http.service';
import PayloadMocks from '../test_data/mocks/payloads/payloads-index';

const server = setupServer();
const testMonaiBasePath = 'https://localhost:7337';

describe('/Payloads Integration Tests', () => {
  let app: INestApplication;

  beforeAll(() => {
    server.listen({
      onUnhandledRequest: 'bypass',
    });
    server.printHandlers();
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(async () => {
    server.resetHandlers();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          // we mock the path to the MONAI API
          load: [
            () => ({
              MONAI_API_HOST: testMonaiBasePath,
            }),
          ],
        }),
        // we register the HttpService with no stubbing! 🎉
        HttpModule.registerAsync({
          useClass: HttpConfigService,
        }),
      ],
      controllers: [PayloadsController],
      providers: [PayloadsService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it.each([
    PayloadMocks.basicPayloads1,
    PayloadMocks.basicPayloads2,
    PayloadMocks.basicPayloads3,
    PayloadMocks.basicPayloads4,
  ])('(GET) /payloads with returned data', async (payload) => {
    server.use(
      rest.get(
        `${testMonaiBasePath}/payload`,
        (_request, response, context) => {
          return response(context.json(payload));
        },
      ),
    );
    const response = await request(app.getHttpServer()).get(
      '/payloads?pageNumber=1&pageSize=10',
    );
    expect(response.body).toMatchSnapshot();
  });

  it('(GET) /payloads without returned data', async () => {
    server.use(
      rest.get(`${testMonaiBasePath}/payload`, (request, response, context) => {
        return response(context.json(PayloadMocks.emptyPayloadData));
      }),
    );
    const response = await request(app.getHttpServer()).get(
      '/payloads?pageNumber=1&pageSize=10',
    );
    expect(response.body).toMatchSnapshot();
  });

  it.each([408, 500, 501, 502, 503, 504])(
    '(GET) /payloads when Monai gives general error',
    async (code) => {
      server.use(
        rest.get(
          `${testMonaiBasePath}/payload`,
          (request, response, context) => {
            return response(context.status(code));
          },
        ),
      );
      const response = await request(app.getHttpServer()).get(
        '/payloads?pageNumber=1&pageSize=10',
      );
      expect(response.statusCode).toBe(500);
      expect(response.body).toMatchSnapshot();
    },
  );

  it.each([
    PayloadMocks.basicExecution1,
    PayloadMocks.basicExecution2,
    PayloadMocks.basicExecution3,
    PayloadMocks.basicExecution4,
    PayloadMocks.basicExecution5,
  ])(
    '(GET) /payloads/:payloadid/executions with returned data',
    async (...payload) => {
      server.use(
        rest.get(
          `${testMonaiBasePath}/workflowinstances`,
          (_request, response, context) => {
            return response(context.json(payload));
          },
        ),
      );
      const response = await request(app.getHttpServer()).get(
        `/payloads/${payload[0].payload_id}/executions`,
      );
      expect(response.body).toMatchSnapshot();
    },
  );

  it('(GET) /payloads/:payloadid/executions without returned data', async () => {
    server.use(
      rest.get(
        `${testMonaiBasePath}/workflowinstances`,
        (request, response, context) => {
          return response(context.json([]));
        },
      ),
    );
    const response = await request(app.getHttpServer()).get(
      '/payloads/a07b72b1-8603-47b0-9a79-da0749261062/executions',
    );
    expect(response.body).toStrictEqual([]);
  });

  it('(GET) /payloads/:payloadid/executions with invalid id', async () => {
    server.use(
      rest.get(
        `${testMonaiBasePath}/workflowinstances`,
        (request, response, context) => {
          return response(
            context.status(400),
            context.json(PayloadMocks.InvalidPayloadIdError),
          );
        },
      ),
    );

    const response = await request(app.getHttpServer()).get(
      '/payloads/invalidID/executions',
    );
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchSnapshot();
  });

  it.each([408, 500, 501, 502, 503, 504])(
    '(GET) /payloads/:payloadid/executions when Monai gives general error',
    async (code) => {
      server.use(
        rest.get(
          `${testMonaiBasePath}/workflowinstances`,
          (request, response, context) => {
            return response(context.status(code));
          },
        ),
      );
      const response = await request(app.getHttpServer()).get(
        '/payloads/a07b72b1-8603-47b0-9a79-da0749261062/executions',
      );
      expect(response.statusCode).toBe(500);
      expect(response.body).toMatchSnapshot();
    },
  );
});
