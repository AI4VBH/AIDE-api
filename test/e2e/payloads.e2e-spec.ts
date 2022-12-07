/*
 * Copyright 2022 Guy’s and St Thomas’ NHS Foundation Trust
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Logger } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import * as request from 'supertest';
import { PayloadsController } from 'modules/admin/payloads/payloads.controller';
import { PayloadsService } from 'modules/admin/payloads/payloads.service';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { HttpConfigService } from 'shared/http/http.service';
import PayloadMocks from '../test_data/mocks/payloads/payloads-index';
import { createMock } from '@golevelup/ts-jest';

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
      providers: [
        PayloadsService,
        {
          provide: Logger,
          useFactory: () => createMock<Logger>(),
        },
      ],
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
    expect(response.status).toBe(200);
  });

  it.each([
    ['3f777daf-8035-445c-a351-81fde5fd7654', 'Test Patient 1'],
    ['3f777daf-8035-445c-a351-81fde5fd7654', ''],
    ['', 'Test Patient 1'],
    ['', ''],
  ])(
    '(GET) /payload includes patient name and id',
    async (patientId, patientName) => {
      let urlParameterPatientName = '';
      let urlParameterPatientId = '';

      server.use(
        rest.get(
          `${testMonaiBasePath}/payload`,
          (_request, response, context) => {
            urlParameterPatientName =
              _request.url.searchParams.get('patientName');
            urlParameterPatientId = _request.url.searchParams.get('patientId');

            return response(context.json(PayloadMocks.basicPayloads1));
          },
        ),
      );

      const response = await request(app.getHttpServer()).get(
        `/payloads?pageNumber=1&pageSize=10&patientId=${patientId}&patientName=${patientName}`,
      );

      if (urlParameterPatientName == null) urlParameterPatientName = '';
      if (urlParameterPatientId == null) urlParameterPatientId = '';

      expect(urlParameterPatientName).toBe(patientName);
      expect(urlParameterPatientId).toBe(patientId);
      expect(response.status).toBe(200);
    },
  );

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
    expect(response.status).toBe(200);
  });

  it.each([408, 500, 501, 502, 503, 504])(
    '(GET) /payloads correct status when MONAI gives general error with code %s',
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
      expect(response.body).toMatchObject({
        message:
          'An error occurred with an external service (MONAI, Clinical Review)',
        statusCode: 500,
      });
      expect(response.statusCode).toBe(500);
    },
  );

  it('(GET) /payloads/:payloadId with returned data', async () => {
    server.use(
      rest.get(
        `${testMonaiBasePath}/payload/${PayloadMocks.basicSinglePayload.payload_id}`,
        (_request, response, context) =>
          response(context.json(PayloadMocks.basicSinglePayload)),
      ),
    );

    const response = await request(app.getHttpServer()).get(
      `/payloads/${PayloadMocks.basicSinglePayload.payload_id}`,
    );

    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(200);
  });

  it('(GET) /payloads/:payloadId with returned data', async () => {
    server.use(
      rest.get(
        `${testMonaiBasePath}/payload/${PayloadMocks.basicSinglePayload.payload_id}`,
        (_request, response, context) =>
          response(context.json(PayloadMocks.basicSinglePayload)),
      ),
    );

    const response = await request(app.getHttpServer()).get(
      `/payloads/${PayloadMocks.basicSinglePayload.payload_id}`,
    );

    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(200);
  });

  it('(GET) /payloads/:payloadId with invalid payload ID', async () => {
    server.use(
      rest.get(
        `${testMonaiBasePath}/payload/1`,
        (_request, response, context) => {
          return response(
            context.status(400),
            context.json({
              title: 'Bad Request',
              status: 400,
              detail: 'Failed to validate id, not a valid guid',
            }),
          );
        },
      ),
    );

    const response = await request(app.getHttpServer()).get(`/payloads/1`);

    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(400);
  });

  it('(GET) /payloads/:payloadId with no payload found', async () => {
    const payloadId = '00000000-0000-0000-0000-000000000001';
    server.use(
      rest.get(
        `${testMonaiBasePath}/payload/${payloadId}`,
        (_request, response, context) => {
          return response(
            context.status(404),
            context.json({
              title: 'Not Found',
              status: 404,
              detail: `Failed to find payload with payload id: ${payloadId}`,
            }),
          );
        },
      ),
    );

    const response = await request(app.getHttpServer()).get(
      `/payloads/${payloadId}`,
    );

    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(404);
  });

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
      expect(response.status).toBe(200);
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
    expect(response.status).toBe(200);
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
    expect(response.body).toMatchSnapshot();
    expect(response.statusCode).toBe(400);
  });

  it.each([408, 500, 501, 502, 503, 504])(
    '(GET) /payloads/:payloadid/executions correct status when MONAI gives general error with code %s',
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
      expect(response.body).toMatchObject({
        message:
          'An error occurred with an external service (MONAI, Clinical Review)',
        statusCode: 500,
      });
      expect(response.statusCode).toBe(500);
    },
  );
});
