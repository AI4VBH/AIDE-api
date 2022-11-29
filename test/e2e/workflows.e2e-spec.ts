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
import WorkflowMocks from '../test_data/mocks/workflows/workflows-index';
import { MonaiWorkflow } from 'modules/workflows/monai-workflow.interfaces';
import { RolesService } from 'modules/roles/roles.service';
import { KeycloakAdminService } from 'shared/keycloak/keycloak-admin.service';

const server = setupServer();
const testMonaiBasePath = 'https://localhost:7337';
const testMigBasePath = 'https://localhost:7338';

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
          load: [
            () => ({
              MONAI_API_HOST: testMonaiBasePath,
              MIG_API_HOST: testMigBasePath,
            }),
          ],
        }),
        // we register the HttpService with no stubbing! 🎉
        HttpModule.registerAsync({
          useClass: HttpConfigService,
        }),
      ],
      controllers: [WorkflowsController],
      providers: [WorkflowsService, RolesService, KeycloakAdminService],
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
    expect(response.status).toBe(200);
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
    expect(response.status).toBe(200);
  });

  it.each([408, 500, 501, 502, 503, 504])(
    '(GET) /workflows correct status when MONAI gives general error with code %s',
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
      expect(response.body).toMatchObject({
        message:
          'An error occurred with an external service (MONAI, Clinical Review)',
        statusCode: 500,
      });
      expect(response.statusCode).toBe(500);
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
      expect(response.statusCode).toBe(200);
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
    expect(response.body).toMatchSnapshot();
    expect(response.statusCode).toBe(404);
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
    expect(response.body).toMatchSnapshot();
    expect(response.statusCode).toBe(400);
  });

  it.each([408, 500, 501, 502, 503, 504])(
    '(GET) /workflows/:id correct status when MONAI gives general error with code %s',
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
      expect(response.body).toMatchObject({
        message:
          'An error occurred with an external service (MONAI, Clinical Review)',
        statusCode: 500,
      });
      expect(response.statusCode).toBe(500);
    },
  );

  it.each([
    [
      WorkflowMocks.singleWorkflow1,
      WorkflowMocks.createdAETitle,
      201,
      WorkflowMocks.basicDestination1,
    ],
    [
      WorkflowMocks.singleWorkflow1,
      WorkflowMocks.existsAETitle,
      409,
      WorkflowMocks.basicDestination1,
    ],
  ])(
    '(PUT) /workflows/:id success with returned data',
    async (putBody, aeResponse, aeStatus, destinationResponse) => {
      server.use(
        rest.put(
          `${testMonaiBasePath}/workflows/${putBody.workflow_id}`,
          (request, response, context) => {
            return response(context.json(WorkflowMocks.postPutResponse));
          },
        ),
        rest.post(
          `${testMigBasePath}/config/ae`,
          (request, response, context) => {
            return response(context.status(aeStatus), context.json(aeResponse));
          },
        ),
        rest.get(
          `${testMigBasePath}/config/destination`,
          (request, response, context) => {
            return response(context.json(destinationResponse));
          },
        ),
      );
      const response = await request(app.getHttpServer())
        .put(`/workflows/${putBody.workflow_id}`)
        .send({ original_workflow_name: 'some body', workflow: putBody });
      expect(response.body).toMatchSnapshot();
      expect(response.statusCode).toBe(200);
    },
  );

  it.each([
    [
      WorkflowMocks.singleWorkflow1,
      WorkflowMocks.invalidBodyAETitle,
      400,
      WorkflowMocks.basicDestination1,
    ],
    [
      WorkflowMocks.singleWorkflow1,
      WorkflowMocks.existsAETitle,
      409,
      WorkflowMocks.basicDestination2,
    ],
  ])(
    '(PUT) /workflows/:id unsuccessful with ae or destination',
    async (putBody, aeResponse, aeStatus, destinationResponse) => {
      server.use(
        rest.put(
          `${testMonaiBasePath}/workflows/${putBody.workflow_id}`,
          (request, response, context) => {
            return response(context.json(WorkflowMocks.postPutResponse));
          },
        ),
        rest.post(
          `${testMigBasePath}/config/ae`,
          (request, response, context) => {
            return response(context.status(aeStatus), context.json(aeResponse));
          },
        ),
        rest.get(
          `${testMigBasePath}/config/destination`,
          (request, response, context) => {
            return response(context.json(destinationResponse));
          },
        ),
      );
      const response = await request(app.getHttpServer())
        .put(`/workflows/${putBody.workflow_id}`)
        .send({ original_workflow_name: 'some body', workflow: putBody });
      expect(response.body).toMatchSnapshot();
      expect(response.statusCode).toBe(400);
    },
  );

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
      rest.post(
        `${testMigBasePath}/config/ae`,
        (request, response, context) => {
          return response(
            context.status(201),
            context.json(WorkflowMocks.createdAETitle),
          );
        },
      ),
      rest.get(
        `${testMigBasePath}/config/destination`,
        (request, response, context) => {
          return response(context.json(WorkflowMocks.basicDestination1));
        },
      ),
    );
    const response = await await request(app.getHttpServer())
      .put('/workflows/0ea7b5b9-64ba-4841-b252-d6e312ef7e8d')
      .send({
        original_workflow_name: 'some body',
        workflow: WorkflowMocks.singleWorkflow1,
      });
    expect(response.body).toMatchSnapshot();
    expect(response.statusCode).toBe(404);
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
      rest.post(
        `${testMigBasePath}/config/ae`,
        (request, response, context) => {
          return response(
            context.status(201),
            context.json(WorkflowMocks.createdAETitle),
          );
        },
      ),
      rest.get(
        `${testMigBasePath}/config/destination`,
        (request, response, context) => {
          return response(context.json(WorkflowMocks.basicDestination1));
        },
      ),
    );
    const response = await await request(app.getHttpServer())
      .put('/workflows/invalidID')
      .send(WorkflowMocks.singleWorkflow1);
    expect(response.body).toMatchSnapshot();
    expect(response.statusCode).toBe(400);
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
      rest.post(
        `${testMigBasePath}/config/ae`,
        (request, response, context) => {
          return response(
            context.status(201),
            context.json(WorkflowMocks.createdAETitle),
          );
        },
      ),
      rest.get(
        `${testMigBasePath}/config/destination`,
        (request, response, context) => {
          return response(context.json(WorkflowMocks.basicDestination1));
        },
      ),
    );
    const response = await await request(app.getHttpServer())
      .put('/workflows/0ea7b5b9-64ba-4841-b252-d6e312ef7e8d')
      .send(WorkflowMocks.singleWorkflow1);
    expect(response.body).toMatchSnapshot();
    expect(response.statusCode).toBe(400);
  });

  it.each([408, 500, 501, 502, 503, 504])(
    '(PUT) /workflows/:id correct status when MONAI gives general error with code %s',
    async (code) => {
      server.use(
        rest.put(
          `${testMonaiBasePath}/workflows/${WorkflowMocks.singleWorkflow1.workflow_id}`,
          (request, response, context) => {
            return response(context.status(code));
          },
        ),
        rest.post(
          `${testMigBasePath}/config/ae`,
          (request, response, context) => {
            return response(
              context.status(201),
              context.json(WorkflowMocks.createdAETitle),
            );
          },
        ),
        rest.get(
          `${testMigBasePath}/config/destination`,
          (request, response, context) => {
            return response(context.json(WorkflowMocks.basicDestination1));
          },
        ),
      );
      const response = await request(app.getHttpServer())
        .put(`/workflows/${WorkflowMocks.singleWorkflow1.workflow_id}`)
        .send(WorkflowMocks.singleWorkflow1);
      expect(response.body).toMatchObject({
        message:
          'An error occurred with an external service (MONAI, Clinical Review)',
        statusCode: 500,
      });
      expect(response.statusCode).toBe(500);
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
    expect(response.statusCode).toBe(200);
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
    expect(response.body).toMatchSnapshot();
    expect(response.statusCode).toBe(404);
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
    expect(response.body).toMatchSnapshot();
    expect(response.statusCode).toBe(400);
  });

  it.each([408, 500, 501, 502, 503, 504])(
    '(DELETE) /workflows/:id correct status when MONAI gives general error with code %s',
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
      expect(response.body).toMatchObject({
        message:
          'An error occurred with an external service (MONAI, Clinical Review)',
        statusCode: 500,
      });
      expect(response.statusCode).toBe(500);
    },
  );

  it.each([
    [
      WorkflowMocks.singleWorkflow1,
      WorkflowMocks.createdAETitle,
      201,
      WorkflowMocks.basicDestination1,
    ],
    [
      WorkflowMocks.singleWorkflow1,
      WorkflowMocks.existsAETitle,
      409,
      WorkflowMocks.basicDestination1,
    ],
  ])(
    '(POST) /workflows success with returned data',
    async (postBody, aeResponse, aeStatus, destinationResponse) => {
      server.use(
        rest.post(
          `${testMonaiBasePath}/workflows`,
          (request, response, context) => {
            return response(context.json(WorkflowMocks.postPutResponse));
          },
        ),
        rest.post(
          `${testMigBasePath}/config/ae`,
          (request, response, context) => {
            return response(context.status(aeStatus), context.json(aeResponse));
          },
        ),
        rest.get(
          `${testMigBasePath}/config/destination`,
          (request, response, context) => {
            return response(context.json(destinationResponse));
          },
        ),
      );
      const response = await request(app.getHttpServer())
        .post(`/workflows`)
        .send(postBody);
      expect(response.body).toMatchSnapshot();
      expect(response.statusCode).toBe(201);
    },
  );

  it.each([
    [
      WorkflowMocks.singleWorkflow1,
      WorkflowMocks.invalidBodyAETitle,
      400,
      WorkflowMocks.basicDestination1,
    ],
    [
      WorkflowMocks.singleWorkflow1,
      WorkflowMocks.existsAETitle,
      409,
      WorkflowMocks.basicDestination2,
    ],
  ])(
    '(POST) /workflows unsuccessful with ae or destination',
    async (postBody, aeResponse, aeStatus, destinationResponse) => {
      server.use(
        rest.post(
          `${testMonaiBasePath}/workflows`,
          (request, response, context) => {
            return response(context.json(WorkflowMocks.postPutResponse));
          },
        ),
        rest.post(
          `${testMigBasePath}/config/ae`,
          (request, response, context) => {
            return response(context.status(aeStatus), context.json(aeResponse));
          },
        ),
        rest.get(
          `${testMigBasePath}/config/destination`,
          (request, response, context) => {
            return response(context.json(destinationResponse));
          },
        ),
      );
      const response = await request(app.getHttpServer())
        .post(`/workflows`)
        .send(postBody);
      expect(response.body).toMatchSnapshot();
      expect(response.statusCode).toBe(400);
    },
  );

  it('(POST) /workflows with invalid body', async () => {
    server.use(
      rest.post(
        `${testMigBasePath}/config/ae`,
        (request, response, context) => {
          return response(
            context.status(201),
            context.json(WorkflowMocks.createdAETitle),
          );
        },
      ),
      rest.get(
        `${testMigBasePath}/config/destination`,
        (request, response, context) => {
          return response(context.json(WorkflowMocks.basicDestination1));
        },
      ),
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
    const response = await await request(app.getHttpServer())
      .post('/workflows')
      .send(WorkflowMocks.singleWorkflow1);
    expect(response.body).toMatchSnapshot();
    expect(response.statusCode).toBe(400);
  });

  it.each([408, 500, 501, 502, 503, 504])(
    '(POST) /workflows correct status when MONAI gives general error with code %s',
    async (code) => {
      server.use(
        rest.post(
          `${testMonaiBasePath}/workflows`,
          (request, response, context) => {
            return response(context.status(code));
          },
        ),
        rest.post(
          `${testMigBasePath}/config/ae`,
          (request, response, context) => {
            return response(
              context.status(201),
              context.json(WorkflowMocks.createdAETitle),
            );
          },
        ),
        rest.get(
          `${testMigBasePath}/config/destination`,
          (request, response, context) => {
            return response(context.json(WorkflowMocks.basicDestination1));
          },
        ),
      );
      const response = await request(app.getHttpServer())
        .post('/workflows')
        .send(WorkflowMocks.singleWorkflow1);
      expect(response.body).toMatchObject({
        message:
          'An error occurred with an external service (MONAI, Clinical Review)',
        statusCode: 500,
      });
      expect(response.statusCode).toBe(500);
    },
  );
});
