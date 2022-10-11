import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import * as request from 'supertest';
import { LogsController } from 'modules/admin/logs/logs.controller';
import { LogsService } from 'modules/admin/logs/logs.service';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { HttpConfigService } from 'shared/http/http.service';
import logMocks from '../test_data/mocks/logs/logs-index';
import { ElasticClient } from 'shared/elastic/elastic-client';

const server = setupServer();
const mockElasticHost = 'localhost';
const mockElasticPort = '7339';
const mockElasticUseSsl = 'true';
const mockElasticUsername = 'username';
const mockElasticPassword = 'password';
const mockElasticIndex = 'logstash*';
const mockHttp = `https://${mockElasticHost}:${mockElasticPort}`;

describe('/Logs Integration Tests', () => {
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
          load: [
            () => ({
              ELASTIC_HOST: mockElasticHost,
              ELASTIC_PORT: mockElasticPort,
              ELASTIC_USE_SSL: mockElasticUseSsl,
              ELASTIC_USERNAME: mockElasticUsername,
              ELASTIC_PASSWORD: mockElasticPassword,
              ELASTIC_INDEX: mockElasticIndex,
            }),
          ],
        }),
        HttpModule.registerAsync({
          useClass: HttpConfigService,
        }),
      ],
      controllers: [LogsController],
      providers: [LogsService, ElasticClient],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it.each([logMocks.basicLogs1, logMocks.basicLogs2, logMocks.basicLogs3])(
    '(GET) /logs/:taskid with returned data',
    async (payload) => {
      server.use(
        rest.post(
          `${mockHttp}/${mockElasticIndex}*/_search`,
          (_request, response, context) => {
            return response(context.json(payload));
          },
        ),
      );
      const response = await request(app.getHttpServer()).get(
        `/logs/04a0cded-6aad-408c-b45d-1852ad54fae3`,
      );
      expect(response.body).toMatchSnapshot();
      expect(response.statusCode).toBe(200);
    },
  );

  it('(GET) /logs/:taskid without returned data', async () => {
    server.use(
      rest.post(
        `${mockHttp}/${mockElasticIndex}*/_search`,
        (request, response, context) => {
          return response(context.json(logMocks.emptyLogData));
        },
      ),
    );
    const response = await request(app.getHttpServer()).get(
      '/logs/ef8dd042-24f6-4dc5-9797-5a55e2492063',
    );
    expect(response.body).toMatchObject([]);
    expect(response.statusCode).toBe(200);
  });

  it('(GET) /logs/:taskid with unparsable query', async () => {
    server.use(
      rest.post(
        `${mockHttp}/${mockElasticIndex}*/_search`,
        (request, response, context) => {
          return response(
            context.status(400),
            context.json(logMocks.unparsableQueryError),
          );
        },
      ),
    );
    const response = await request(app.getHttpServer()).get(
      '/logs/6d4a5567-d87a-4784-8078-954ec2d9bd68',
    );
    expect(response.body).toMatchObject([]);
    expect(response.statusCode).toBe(200);
  });

  it.each([408, 500, 501, 502, 503, 504])(
    '(GET) /logs/:taskid when Elastic gives general error',
    async (code) => {
      server.use(
        rest.post(
          `${mockHttp}/${mockElasticIndex}*/_search`,
          (request, response, context) => {
            return response(context.status(code));
          },
        ),
      );
      const response = await request(app.getHttpServer()).get(
        '/logs/0b0c725b-5700-49e2-b733-81759801c935',
      );
      expect(response.body).toMatchObject([]);
      expect(response.statusCode).toBe(200);
    },
  );
});
