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
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { HttpConfigService } from 'shared/http/http.service';
import IssuesMocks from '../test_data/mocks/issues/issues';
import { IssuesController } from 'modules/admin/issues/issues.controller';
import { IssuesService } from 'modules/admin/issues/issues.service';
import { WorkflowInstancesService } from 'modules/admin/workflowinstances/workflowinstances.service';
import { WorkflowInstanceController } from 'modules/admin/workflowinstances/workflowinstances.controller';
import { createMock } from '@golevelup/ts-jest';

const server = setupServer();
const testMonaiBasePath = 'https://localhost:7337';

describe('/issues integration Tests', () => {
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
      controllers: [IssuesController, WorkflowInstanceController],
      providers: [
        IssuesService,
        WorkflowInstancesService,
        {
          provide: Logger,
          useFactory: () => createMock<Logger>(),
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('(GET) issues/failed?acknowledged=YYYY-MM-DD - Multiple workflow instances with 1 failed task each', async () => {
    server.use(
      rest.get(
        `${testMonaiBasePath}/workflowinstances/failed`,
        (_request, response, context) => {
          return response(context.json(IssuesMocks.failedTasks1));
        },
      ),
      rest.get(
        `${testMonaiBasePath}/payload/fea1bc88-73e3-436a-aa6e-83364ff8d7d1`,
        (_request, response, context) => {
          return response(context.json(IssuesMocks.payload1));
        },
      ),
      rest.get(
        `${testMonaiBasePath}/payload/a0e7b480-1bd8-41f9-a6cf-1ab7952aab32`,
        (_request, response, context) => {
          return response(context.json(IssuesMocks.payload2));
        },
      ),
      rest.get(
        `${testMonaiBasePath}/payload/3147c4b5-6652-4d25-82f8-f9ed58b74e43`,
        (_request, response, context) => {
          return response(context.json(IssuesMocks.payload3));
        },
      ),
    );
    const response = await request(app.getHttpServer()).get(
      '/issues/failed?acknowledged=2022-01-01',
    );
    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(200);
  });

  it('(GET) issues/failed?acknowledged=YYYY-MM-DD - Multiple workflow instances with 1 failed task each, with time', async () => {
    server.use(
      rest.get(
        `${testMonaiBasePath}/workflowinstances/failed`,
        (_request, response, context) => {
          return response(context.json(IssuesMocks.failedTasks1));
        },
      ),
      rest.get(
        `${testMonaiBasePath}/payload/fea1bc88-73e3-436a-aa6e-83364ff8d7d1`,
        (_request, response, context) => {
          return response(context.json(IssuesMocks.payload1));
        },
      ),
      rest.get(
        `${testMonaiBasePath}/payload/a0e7b480-1bd8-41f9-a6cf-1ab7952aab32`,
        (_request, response, context) => {
          return response(context.json(IssuesMocks.payload2));
        },
      ),
      rest.get(
        `${testMonaiBasePath}/payload/3147c4b5-6652-4d25-82f8-f9ed58b74e43`,
        (_request, response, context) => {
          return response(context.json(IssuesMocks.payload3));
        },
      ),
    );
    const response = await request(app.getHttpServer()).get(
      '/issues/failed?acknowledged=2022-01-01T01:01:01',
    );
    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(200);
  });

  it('(GET) issues/failed?acknowledged=YYYY-MM-DD - Single workflow instance with multiple failed tasks', async () => {
    server.use(
      rest.get(
        `${testMonaiBasePath}/workflowinstances/failed`,
        (_request, response, context) => {
          return response(context.json(IssuesMocks.failedTasks2));
        },
      ),
      rest.get(
        `${testMonaiBasePath}/payload/fea1bc88-73e3-436a-aa6e-83364ff8d7d1`,
        (_request, response, context) => {
          return response(context.json(IssuesMocks.payload1));
        },
      ),
    );
    const response = await request(app.getHttpServer()).get(
      '/issues/failed?acknowledged=2022-01-01',
    );
    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(200);
  });

  it('(GET) issues/failed?acknowledged=YYYY-MM-DD - Single workflow instance with multiple failed tasks, with time', async () => {
    server.use(
      rest.get(
        `${testMonaiBasePath}/workflowinstances/failed`,
        (_request, response, context) => {
          return response(context.json(IssuesMocks.failedTasks2));
        },
      ),
      rest.get(
        `${testMonaiBasePath}/payload/fea1bc88-73e3-436a-aa6e-83364ff8d7d1`,
        (_request, response, context) => {
          return response(context.json(IssuesMocks.payload1));
        },
      ),
    );
    const response = await request(app.getHttpServer()).get(
      '/issues/failed?acknowledged=2022-01-01T01:01:01',
    );
    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(200);
  });

  it('(GET) issues/failed?acknowledged=YYYY-MM-DD - No workflow instances returned', async () => {
    server.use(
      rest.get(
        `${testMonaiBasePath}/workflowinstances/failed`,
        (_request, response, context) => {
          return response(
            context.status(404),
            context.json(IssuesMocks.noUnacknowledgedTasksError),
          );
        },
      ),
    );
    const response = await request(app.getHttpServer()).get(
      '/issues/failed?acknowledged=2022-01-01',
    );
    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(404);
  });

  it('(GET) issues/failed?acknowledged=YYYY-MM-DD - Workflow instance exists but no matching payload', async () => {
    server.use(
      rest.get(
        `${testMonaiBasePath}/workflowinstances/failed`,
        (_request, response, context) => {
          return response(context.json(IssuesMocks.failedTasks2));
        },
      ),
      rest.get(
        `${testMonaiBasePath}/payload/fea1bc88-73e3-436a-aa6e-83364ff8d7d1`,
        (_request, response, context) => {
          return response(
            context.status(404),
            context.json(IssuesMocks.noMatchingPayload),
          );
        },
      ),
    );
    const response = await request(app.getHttpServer()).get(
      '/issues/failed?acknowledged=2022-01-01',
    );
    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(404);
  });

  it('(GET) issues/failed?acknowledged=YYYY-MM-DD - Invalid date, workflow instance date in the future', async () => {
    server.use(
      rest.get(
        `${testMonaiBasePath}/workflowinstances/failed`,
        (_request, response, context) => {
          return response(
            context.status(400),
            context.json(IssuesMocks.invalidDate),
          );
        },
      ),
    );
    const response = await request(app.getHttpServer()).get(
      '/issues/failed?acknowledged=2023-01-01',
    );
    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(400);
  });

  it('(GET) issues/failed?acknowledged=YYYY-MM-DD - Payload id is invalid GUID', async () => {
    server.use(
      rest.get(
        `${testMonaiBasePath}/workflowinstances/failed`,
        (_request, response, context) => {
          return response(context.json(IssuesMocks.invalidPayloadId));
        },
      ),
      rest.get(
        `${testMonaiBasePath}/payload/invalid-guid`,
        (_request, response, context) => {
          return response(
            context.status(400),
            context.json(IssuesMocks.invalidPayloadError),
          );
        },
      ),
    );
    const response = await request(app.getHttpServer()).get(
      '/issues/failed?acknowledged=2022-01-01',
    );
    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(400);
  });

  it.each([408, 500, 501, 502, 503, 504])(
    '(GET) issues/failed?acknowledged=YYYY-MM-DD - correct status when MONAI gives general error for /workflowinstances/failed with code %s',
    async (code) => {
      server.use(
        rest.get(
          `${testMonaiBasePath}/workflowinstances/failed`,
          (_request, response, context) => {
            return response(context.status(code));
          },
        ),
      );
      const response = await request(app.getHttpServer()).get(
        '/issues/failed?acknowledged=2022-01-01',
      );
      expect(response.body).toMatchObject({
        message:
          'An error occurred with an external service (MONAI, Clinical Review)',
        statusCode: 500,
      });
      expect(response.status).toBe(500);
    },
  );

  it.each([408, 500, 501, 502, 503, 504])(
    '(GET) issues/failed?acknowledged=YYYY-MM-DD - correct status when MONAI gives general error for /payload/:UUID with code %s',
    async (code) => {
      server.use(
        rest.get(
          `${testMonaiBasePath}/workflowinstances/failed`,
          (_request, response, context) => {
            return response(context.json(IssuesMocks.failedTasks2));
          },
        ),
        rest.get(
          `${testMonaiBasePath}/payload/fea1bc88-73e3-436a-aa6e-83364ff8d7d1`,
          (_request, response, context) => {
            return response(context.status(code));
          },
        ),
      );
      const response = await request(app.getHttpServer()).get(
        '/issues/failed?acknowledged=2022-01-01',
      );
      expect(response.body).toMatchObject({
        message:
          'An error occurred with an external service (MONAI, Clinical Review)',
        statusCode: 500,
      });
      expect(response.status).toBe(500);
    },
  );
});
