import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import * as request from 'supertest';
import { WorkflowsController } from 'modules/workflows/workflows.controller';
import { WorkflowsService } from 'modules/workflows/workflows.service';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { HttpConfigService } from 'shared/http/http.service';
import WorkflowMocks from '../test_data/mocks/workflows/workflowsIndex';
import { MonaiWorkflow } from 'modules/workflows/monai-workflow.interfaces';

const server = setupServer();
const testMonaiBasePath = 'https://localhost:7337';

describe('/Workflows Integration Tests', () => {
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
      controllers: [WorkflowsController],
      providers: [WorkflowsService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it.each([
    WorkflowMocks.basicWorkflows1,
    WorkflowMocks.basicWorkflows2,
    WorkflowMocks.basicWorkflows3,
    WorkflowMocks.basicWorkflows4,
  ])('(GET) /workflows with returned data', async (workflow) => {
    server.use(
      rest.get(
        `${testMonaiBasePath}/workflows`,
        (request, response, context) => {
          return response(context.json(workflow));
        },
      ),
    );
    const response = await request(app.getHttpServer()).get(
      '/workflows?pageNumber=1&pageSize=10',
    );
    expect(response.body).toMatchSnapshot();
  });

  it('(GET) /workflows without returned data', async () => {
    server.use(
      rest.get(
        `${testMonaiBasePath}/workflows`,
        (request, response, context) => {
          return response(context.json(WorkflowMocks.emptyWorkflowData));
        },
      ),
    );
    const response = await request(app.getHttpServer()).get(
      '/workflows?pageNumber=1&pageSize=10',
    );
    expect(response.body).toMatchSnapshot();
  });

  it.each([408, 500, 501, 502, 503, 504])(
    '(GET) /workflows when Monai gives general error',
    async (code) => {
      server.use(
        rest.get(
          `${testMonaiBasePath}/workflows`,
          (request, response, context) => {
            return response(context.status(code));
          },
        ),
      );
      const response = await request(app.getHttpServer()).get(
        '/workflows?pageNumber=1&pageSize=10',
      );
      expect(response.statusCode).toBe(500);
      expect(response.body).toMatchSnapshot();
    },
  );

  it.each([
    WorkflowMocks.singleWorkflow1,
    WorkflowMocks.singleWorkflow2,
    WorkflowMocks.singleWorkflow3,
  ])(
    '(GET) /workflows/:id with returned data',
    async (workflow: MonaiWorkflow) => {
      server.use(
        rest.get(
          `${testMonaiBasePath}/workflows/${workflow.workflow_id}`,
          (request, response, context) => {
            return response(context.json(workflow));
          },
        ),
      );
      const response = await request(app.getHttpServer()).get(
        `/workflows/${workflow.workflow_id}`,
      );
      expect(response.body).toMatchSnapshot();
    },
  );

  it('(GET) /workflows/:id with non-existent id', async () => {
    server.use(
      rest.get(
        `${testMonaiBasePath}/workflows/41c5778c-9957-4cfd-be7a-c0bbff5c7cca`,
        (request, response, context) => {
          return response(
            context.status(404),
            context.json(WorkflowMocks.nonExistentGetWorkflowError),
          );
        },
      ),
    );
    const response = await request(app.getHttpServer()).get(
      '/workflows/41c5778c-9957-4cfd-be7a-c0bbff5c7cca',
    );
    expect(response.statusCode).toBe(404);
    expect(response.body).toMatchSnapshot();
  });

  it('(GET) /workflows/:id with invalid id', async () => {
    server.use(
      rest.get(
        `${testMonaiBasePath}/workflows/invalidID`,
        (request, response, context) => {
          return response(
            context.status(400),
            context.json(WorkflowMocks.invalidWorkflowIdError),
          );
        },
      ),
    );
    const response = await request(app.getHttpServer()).get(
      '/workflows/invalidID',
    );
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchSnapshot();
  });

  it.each([408, 500, 501, 502, 503, 504])(
    '(GET) /workflows/:id when Monai gives general error',
    async (code) => {
      server.use(
        rest.get(
          `${testMonaiBasePath}/workflows/41c5778c-9957-4cfd-be7a-c0bbff5c7cca`,
          (request, response, context) => {
            return response(context.status(code));
          },
        ),
      );
      const response = await request(app.getHttpServer()).get(
        '/workflows/41c5778c-9957-4cfd-be7a-c0bbff5c7cca',
      );
      expect(response.statusCode).toBe(500);
      expect(response.body).toMatchSnapshot();
    },
  );

  it('(PUT) /workflows/:id success with returned data', async () => {
    server.use(
      rest.put(
        `${testMonaiBasePath}/workflows/${WorkflowMocks.postPutResponse.workflow_id}`,
        (request, response, context) => {
          return response(context.json(WorkflowMocks.postPutResponse));
        },
      ),
    );
    const response = await request(app.getHttpServer()).put(
      `/workflows/${WorkflowMocks.postPutResponse.workflow_id}`,
    );
    expect(response.body).toMatchSnapshot();
  });

  it('(PUT) /workflows/:id with non-existent id', async () => {
    server.use(
      rest.put(
        `${testMonaiBasePath}/workflows/0ea7b5b9-64ba-4841-b252-d6e312ef7e8d`,
        (request, response, context) => {
          return response(
            context.status(404),
            context.json(WorkflowMocks.nonExistentPutWorkflowError),
          );
        },
      ),
    );
    const response = await request(app.getHttpServer()).put(
      '/workflows/0ea7b5b9-64ba-4841-b252-d6e312ef7e8d',
    );
    expect(response.statusCode).toBe(404);
    expect(response.body).toMatchSnapshot();
  });

  it('(PUT) /workflows/:id with invalid id', async () => {
    server.use(
      rest.put(
        `${testMonaiBasePath}/workflows/invalidID`,
        (request, response, context) => {
          return response(
            context.status(400),
            context.json(WorkflowMocks.invalidWorkflowIdError),
          );
        },
      ),
    );
    const response = await request(app.getHttpServer()).put(
      '/workflows/invalidID',
    );
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchSnapshot();
  });

  it('(PUT) /workflows/:id with invalid body', async () => {
    server.use(
      rest.put(
        `${testMonaiBasePath}/workflows/0ea7b5b9-64ba-4841-b252-d6e312ef7e8d`,
        (request, response, context) => {
          return response(
            context.status(400),
            context.json(WorkflowMocks.invalidWorkflowBodyError),
          );
        },
      ),
    );
    const response = await request(app.getHttpServer()).put(
      '/workflows/0ea7b5b9-64ba-4841-b252-d6e312ef7e8d',
    );
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchSnapshot();
  });

  it.each([408, 500, 501, 502, 503, 504])(
    '(PUT) /workflows/:id when Monai gives general error',
    async (code) => {
      server.use(
        rest.put(
          `${testMonaiBasePath}/workflows/41c5778c-9957-4cfd-be7a-c0bbff5c7cca`,
          (request, response, context) => {
            return response(context.status(code));
          },
        ),
      );
      const response = await request(app.getHttpServer()).put(
        '/workflows/41c5778c-9957-4cfd-be7a-c0bbff5c7cca',
      );
      expect(response.statusCode).toBe(500);
      expect(response.body).toMatchSnapshot();
    },
  );

  it('(DELETE) /workflows/:id with returned data', async () => {
    server.use(
      rest.delete(
        `${testMonaiBasePath}/workflows/${WorkflowMocks.singleWorkflow1.workflow_id}`,
        (request, response, context) => {
          return response(context.json(WorkflowMocks.singleWorkflow1));
        },
      ),
    );
    const response = await request(app.getHttpServer()).delete(
      `/workflows/${WorkflowMocks.singleWorkflow1.workflow_id}`,
    );
    expect(response.body).toMatchSnapshot();
  });

  it('(DELETE) /workflows/:id with non-existent id', async () => {
    server.use(
      rest.delete(
        `${testMonaiBasePath}/workflows/41c5778c-9957-4cfd-be7a-c0bbff5c7cca`,
        (request, response, context) => {
          return response(
            context.status(404),
            context.json(WorkflowMocks.nonExistentGetWorkflowError),
          );
        },
      ),
    );
    const response = await request(app.getHttpServer()).delete(
      '/workflows/41c5778c-9957-4cfd-be7a-c0bbff5c7cca',
    );
    expect(response.statusCode).toBe(404);
    expect(response.body).toMatchSnapshot();
  });

  it('(DELETE) /workflows/:id with invalid id', async () => {
    server.use(
      rest.delete(
        `${testMonaiBasePath}/workflows/invalidID`,
        (request, response, context) => {
          return response(
            context.status(400),
            context.json(WorkflowMocks.invalidWorkflowIdError),
          );
        },
      ),
    );
    const response = await request(app.getHttpServer()).delete(
      '/workflows/invalidID',
    );
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchSnapshot();
  });

  it.each([408, 500, 501, 502, 503, 504])(
    '(DELETE) /workflows/:id when Monai gives general error',
    async (code) => {
      server.use(
        rest.delete(
          `${testMonaiBasePath}/workflows/41c5778c-9957-4cfd-be7a-c0bbff5c7cca`,
          (request, response, context) => {
            return response(context.status(code));
          },
        ),
      );
      const response = await request(app.getHttpServer()).delete(
        '/workflows/41c5778c-9957-4cfd-be7a-c0bbff5c7cca',
      );
      expect(response.statusCode).toBe(500);
      expect(response.body).toMatchSnapshot();
    },
  );

  it('(POST) /workflows success with returned data', async () => {
    server.use(
      rest.post(
        `${testMonaiBasePath}/workflows`,
        (request, response, context) => {
          return response(context.json(WorkflowMocks.postPutResponse));
        },
      ),
    );
    const response = await request(app.getHttpServer()).post(`/workflows`);
    expect(response.body).toMatchSnapshot();
  });

  it('(POST) /workflows with invalid body', async () => {
    server.use(
      rest.post(
        `${testMonaiBasePath}/workflows`,
        (request, response, context) => {
          return response(
            context.status(400),
            context.json(WorkflowMocks.invalidWorkflowBodyError),
          );
        },
      ),
    );
    const response = await request(app.getHttpServer()).post('/workflows');
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchSnapshot();
  });
});
