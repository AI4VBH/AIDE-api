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
import { INestApplication } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import * as request from 'supertest';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { HttpConfigService } from 'shared/http/http.service';
import WorkflowInstanceMocks from '../test_data/mocks/workflow-instances/workflow-instances';
import { WorkflowInstanceController } from 'modules/admin/workflowinstances/workflowinstances.controller';
import { WorkflowInstancesService } from 'modules/admin/workflowinstances/workflowinstances.service';

const server = setupServer();
const testMonaiBasePath = 'https://localhost:7337';

describe('/workflowinstances integration Tests', () => {
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
      controllers: [WorkflowInstanceController],
      providers: [WorkflowInstancesService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('(PUT) /workflowinstances/{workflowInstanceId}/executions/{executionId}/acknowledge with returned data', async () => {
    server.use(
      rest.put(
        `${testMonaiBasePath}/workflowinstances/a67a7af7-068b-44b8-a81b-def7b3e5403b/executions/3b9d94b9-4285-45d4-bea9-491fa62b8f91/acknowledge`,
        (_request, response, context) => {
          return response(
            context.json(WorkflowInstanceMocks.workflowInstance2),
          );
        },
      ),
    );
    const response = await request(app.getHttpServer()).put(
      '/workflowinstances/a67a7af7-068b-44b8-a81b-def7b3e5403b/executions/3b9d94b9-4285-45d4-bea9-491fa62b8f91/acknowledge',
    );
    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(200);
  });

  it('(PUT) /workflowinstances/{workflowInstanceId}/executions/{executionId}/acknowledge - Non existent workflow instance id', async () => {
    server.use(
      rest.put(
        `${testMonaiBasePath}/workflowinstances/a67a7af7-068b-44b8-a81b-def7b3e5403b/executions/3b9d94b9-4285-45d4-bea9-491fa62b8f91/acknowledge`,
        (_request, response, context) => {
          return response(
            context.status(404),
            context.json(WorkflowInstanceMocks.nonExistentWorkflowInstanceId),
          );
        },
      ),
    );
    const response = await request(app.getHttpServer()).put(
      '/workflowinstances/a67a7af7-068b-44b8-a81b-def7b3e5403b/executions/3b9d94b9-4285-45d4-bea9-491fa62b8f91/acknowledge',
    );
    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(404);
  });

  it('(PUT) /workflowinstances/{workflowInstanceId}/executions/{executionId}/acknowledge - Non existent execution id', async () => {
    server.use(
      rest.put(
        `${testMonaiBasePath}/workflowinstances/a67a7af7-068b-44b8-a81b-def7b3e5403b/executions/3b9d94b9-4285-45d4-bea9-491fa62b8g66/acknowledge`,
        (_request, response, context) => {
          return response(
            context.status(404),
            context.json(WorkflowInstanceMocks.nonExistentExecutionId),
          );
        },
      ),
    );
    const response = await request(app.getHttpServer()).put(
      '/workflowinstances/a67a7af7-068b-44b8-a81b-def7b3e5403b/executions/3b9d94b9-4285-45d4-bea9-491fa62b8g66/acknowledge',
    );
    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(404);
  });

  it('(PUT) /workflowinstances/{workflowInstanceId}/executions/{executionId}/acknowledge - Invalid workflow instance ID', async () => {
    server.use(
      rest.put(
        `${testMonaiBasePath}/workflowinstances/invalidGUID/executions/3b9d94b9-4285-45d4-bea9-491fa62b8f91/acknowledge`,
        (_request, response, context) => {
          return response(
            context.status(400),
            context.json(WorkflowInstanceMocks.invalidWorkflowInstanceId),
          );
        },
      ),
    );
    const response = await request(app.getHttpServer()).put(
      '/workflowinstances/invalidGUID/executions/3b9d94b9-4285-45d4-bea9-491fa62b8f91/acknowledge',
    );
    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(400);
  });

  it('(PUT) /workflowinstances/{workflowInstanceId}/executions/{executionId}/acknowledge - Invalid execution ID', async () => {
    server.use(
      rest.put(
        `${testMonaiBasePath}/workflowinstances/a67a7af7-068b-44b8-a81b-def7b3e5403b/executions/invalidGUID/acknowledge`,
        (_request, response, context) => {
          return response(
            context.status(400),
            context.json(WorkflowInstanceMocks.invalidExecutionId),
          );
        },
      ),
    );
    const response = await request(app.getHttpServer()).put(
      '/workflowinstances/a67a7af7-068b-44b8-a81b-def7b3e5403b/executions/invalidGUID/acknowledge',
    );
    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(400);
  });

  it.each([408, 500, 501, 502, 503, 504])(
    '(PUT) /workflowinstances/{workflowInstanceId}/executions/{executionId}/acknowledge - correct status when MONAI gives general error with code %s',
    async (code) => {
      server.use(
        rest.put(
          `${testMonaiBasePath}/workflowinstances/a67a7af7-068b-44b8-a81b-def7b3e5403b/executions/3b9d94b9-4285-45d4-bea9-491fa62b8f91/acknowledge`,
          (request, response, context) => {
            return response(context.status(code));
          },
        ),
      );
      const response = await request(app.getHttpServer()).put(
        '/workflowinstances/a67a7af7-068b-44b8-a81b-def7b3e5403b/executions/3b9d94b9-4285-45d4-bea9-491fa62b8f91/acknowledge',
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
