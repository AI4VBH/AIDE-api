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

import * as emptyPayload from './mocks/payloads/empty-data.json';
import * as basicPayload from './mocks/payloads/basic-payload-1.json';
import { URLSearchParams } from 'url';

const server = setupServer();
const testMonaiBasePath = 'https://localhost:7337';

describe('Payloads Controller', () => {
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
          load: [() => ({ MONAI_API_HOST: testMonaiBasePath })],
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
    {},
    { pageNumber: '0', pageSize: '0' },
    { pageNumber: '-1', pageSize: '-1' },
  ])('(GET) /payloads throws exception when query is invalid', (params) => {
    const query = new URLSearchParams(params);

    return request(app.getHttpServer()).get(`/payloads?${query}`).expect(400);
  });

  it.each([
    [emptyPayload, {}],
    [basicPayload, {}],
  ])('(GET) /payloads', (payload, expected) => {
    /**
     * we are providing a specific response
     * you can also pass in objects
     *
     * return res(ctx.json({}));
     */
    server.use(
      rest.get(`${testMonaiBasePath}/payload`, (request, response, context) => {
        return response(context.json(payload));
      }),
    );

    return request(app.getHttpServer())
      .get('/payloads?pageNumber=1&pageSize=10')
      .expect(200)
      .expect(expected);
  });
});
