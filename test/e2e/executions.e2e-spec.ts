import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import * as request from 'supertest';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { HttpConfigService } from 'shared/http/http.service';
import ExecutionsMock from 'test/test_data/mocks/executions/executions-index';
import { MinioClient } from 'shared/minio/minio-client';
import { ExecutionsController } from 'modules/admin/executions/executions.controller';
import { ExecutionsService } from 'modules/admin/executions/executions.service';

const server = setupServer();
const testMonaiBasePath = 'https://localhost:7337';

describe('/executions Integration Tests', () => {
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
              MONAI_API_HOST: testMonaiBasePath,
              MINIO_HOST: 'localhost',
              MINIO_PORT: 9000,
              MINIO_USE_SSL: false,
              MINIO_ACCESS_KEY: 'access-key',
              MINIO_SECRET_KEY: 'secret-key',
              MINIO_BUCKET: 'bucket-name',
            }),
          ],
        }),
        HttpModule.registerAsync({
          useClass: HttpConfigService,
        }),
      ],
      controllers: [ExecutionsController],
      providers: [ExecutionsService, MinioClient],
    }).compile();
    app = moduleFixture.createNestApplication();
    // app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  it('(GET) /executions/:workflow_inst_id/tasks/:execution_id/artifacts no artifacts', async () => {
    server.use(
      rest.get(
        `${testMonaiBasePath}/workflowinstances/73909439-57da-465e-b529-2addd36cbcd9`,
        (_req, res, ctx) => {
          return res(ctx.json(ExecutionsMock.noArtifacts));
        },
      ),
    );
    const response = await request(app.getHttpServer()).get(
      '/executions/73909439-57da-465e-b529-2addd36cbcd9/tasks/fd89296e-29b7-4d54-be27-26e185db820c/artifacts',
    );
    expect(response.body).toMatchObject({});
    expect(response.status).toBe(200);
  });

  it('(GET) /executions/:workflow_inst_id/tasks/:execution_id/artifacts with artifacts', async () => {
    server.use(
      rest.get(
        `${testMonaiBasePath}/workflowinstances/a67a7af7-068b-44b8-a81b-def7b3e5403b`,
        (_req, res, ctx) => {
          return res(ctx.json(ExecutionsMock.withArtifacts));
        },
      ),
    );
    const response = await request(app.getHttpServer()).get(
      '/executions/a67a7af7-068b-44b8-a81b-def7b3e5403b/tasks/3b9d94b9-4285-45d4-bea9-491fa62b8f91/artifacts',
    );
    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(200);
  });

  it('(GET) /executions/:workflow_inst_id/tasks/:execution_id/artifacts workflow instance does not exist', async () => {
    server.use(
      rest.get(
        `${testMonaiBasePath}/workflowinstances/41c5778c-9957-4cfd-be7a-c0bbff5c7cca`,
        (_req, res, ctx) => {
          return res(
            ctx.status(404),
            ctx.json(ExecutionsMock.nonExistentWorkflow),
          );
        },
      ),
    );
    const response = await request(app.getHttpServer()).get(
      '/executions/41c5778c-9957-4cfd-be7a-c0bbff5c7cca/tasks/3b9d94b9-4285-45d4-bea9-491fa62b8f91/artifacts',
    );
    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(404);
  });

  it('(GET) /executions/:workflow_inst_id/tasks/:execution_id/artifacts execution id does not exist', async () => {
    server.use(
      rest.get(
        `${testMonaiBasePath}/workflowinstances/a67a7af7-068b-44b8-a81b-def7b3e5403b`,
        (_req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json(ExecutionsMock.nonExistentExecutionId),
          );
        },
      ),
    );
    const response = await request(app.getHttpServer()).get(
      '/executions/a67a7af7-068b-44b8-a81b-def7b3e5403b/tasks/6b9d94b9-4285-45d4-bea9-491fa62b8f88/artifacts',
    );
    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(404);
  });

  it('(GET) /executions/:workflow_inst_id/tasks/:execution_id/artifacts invalid workflow instance GUID', async () => {
    server.use(
      rest.get(
        `${testMonaiBasePath}/workflowinstances/invalidguid`,
        (_req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json(ExecutionsMock.invalidWorkflowId),
          );
        },
      ),
    );
    const response = await request(app.getHttpServer()).get(
      '/executions/invalidguid/tasks/3b9d94b9-4285-45d4-bea9-491fa62b8f91/artifacts',
    );
    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(400);
  });

  it('(GET) /executions/:workflow_inst_id/tasks/:execution_id/artifacts invalid execution GUID', async () => {
    const response = await request(app.getHttpServer()).get(
      '/executions/ccfae83b-fc6d-475e-8dc0-6c5ea1904699/tasks/invalidGuid/artifacts',
    );
    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(400);
  });

  it.each([408, 500, 501, 502, 503, 504])(
    '(GET) /payloads when Monai gives general error',
    async (code) => {
      server.use(
        rest.get(
          `${testMonaiBasePath}/workflowinstances/a67a7af7-068b-44b8-a81b-def7b3e5403b`,
          (_req, res, ctx) => {
            return res(ctx.status(code));
          },
        ),
      );
      const response = await request(app.getHttpServer()).get(
        '/executions/a67a7af7-068b-44b8-a81b-def7b3e5403b/tasks/6b9d94b9-4285-45d4-bea9-491fa62b8f88/artifacts',
      );
      expect(response.body).toMatchSnapshot();
      expect(response.statusCode).toBe(500);
    },
  );

  it('(GET) /executions/artifact-download?key=minio-object-key minio with download link', async () => {
    server.use(
      rest.get(`http://localhost:9000/bucket-name`, (_req, res, ctx) => {
        return res(ctx.status(200), ctx.body('www.madeupurl.com'));
      }),
    );
    const response = await request(app.getHttpServer()).get(
      '/executions/artifact-download?key=minio-object-key',
    );
    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(302);
  });

  it('(GET) /executions/artifact-download minio object key does not exist', async () => {
    const response = await request(app.getHttpServer()).get(
      '/executions/artifact-download',
    );
    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(400);
  });

  it.each([408, 500, 501, 502, 503, 504])(
    '(GET) /executions/artifact-download?key=minio-object-key minio returns general error',
    async (code) => {
      server.use(
        rest.get(`http://localhost:9000/bucket-name`, (_req, res, ctx) => {
          return res(ctx.status(code));
        }),
      );
      const response = await request(app.getHttpServer()).get(
        '/executions/artifact-download?key=minio-object-key',
      );
      expect(response.body).toMatchSnapshot();
      expect(response.statusCode).toBe(500);
    },
  );

  it('(GET) /executions/${workflow_instance_id}/tasks/${execution_id}/metadata json object', async () => {
    server.use(
      rest.get(
        `${testMonaiBasePath}/workflowinstances/a67a7af7-068b-44b8-a81b-def7b3e5403b`,
        (req, res, ctx) => {
          return res(ctx.json(ExecutionsMock.metadata));
        },
      ),
    );
    const response = await request(app.getHttpServer()).get(
      '/executions/a67a7af7-068b-44b8-a81b-def7b3e5403b/tasks/3b9d94b9-4285-45d4-bea9-491fa62b8f91/metadata',
    );
    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(200);
  });

  it('(GET) /executions/${workflow_instance_id}/tasks/${execution_id}/metadata empty json', async () => {
    server.use(
      rest.get(
        `${testMonaiBasePath}/workflowinstances/a67a7af7-068b-44b8-a81b-def7b3e5403b`,
        (req, res, ctx) => {
          return res(ctx.json(ExecutionsMock.metadataEmpty));
        },
      ),
    );
    const response = await request(app.getHttpServer()).get(
      '/executions/a67a7af7-068b-44b8-a81b-def7b3e5403b/tasks/3b9d94b9-4285-45d4-bea9-491fa62b8f91/metadata',
    );
    expect(response.body).toMatchObject({});
    expect(response.status).toBe(200);
  });

  it('(GET) /executions/${workflow_instance_id}/tasks/${execution_id}/metadata metadata - workflow instance does not exist', async () => {
    server.use(
      rest.get(
        `${testMonaiBasePath}/workflowinstances/a67a7af7-068b-44b8-a81b-def7b3e5403b`,
        (req, res, ctx) => {
          return res(
            ctx.status(404),
            ctx.json(ExecutionsMock.nonExistentWorkflow),
          );
        },
      ),
    );
    const response = await request(app.getHttpServer()).get(
      '/executions/a67a7af7-068b-44b8-a81b-def7b3e5403b/tasks/3b9d94b9-4285-45d4-bea9-491fa62b8f91/metadata',
    );
    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(404);
  });

  it('(GET) /executions/${workflow_instance_id}/tasks/${execution_id}/metadata metadata - execution id does not exist', async () => {
    server.use(
      rest.get(
        `${testMonaiBasePath}/workflowinstances/a67a7af7-068b-44b8-a81b-def7b3e5403b`,
        (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json(ExecutionsMock.nonExistentExecutionId),
          );
        },
      ),
    );
    const response = await request(app.getHttpServer()).get(
      '/executions/a67a7af7-068b-44b8-a81b-def7b3e5403b/tasks/6b9d94b9-4285-45d4-bea9-491fa62b8f88/metadata',
    );
    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(404);
  });

  it('(GET) /executions/${workflow_instance_id}/tasks/${execution_id}/metadata metadata - invalid workflow instance GUID', async () => {
    server.use(
      rest.get(
        `${testMonaiBasePath}/workflowinstances/invalidguid`,
        (_req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json(ExecutionsMock.invalidWorkflowId),
          );
        },
      ),
    );
    const response = await request(app.getHttpServer()).get(
      '/executions/invalidguid/tasks/3b9d94b9-4285-45d4-bea9-491fa62b8f91/metadata',
    );
    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(400);
  });

  it('(GET) /executions/${workflow_instance_id}/tasks/${execution_id}/metadata metadata - invalid execution GUID', async () => {
    const response = await request(app.getHttpServer()).get(
      '/executions/ccfae83b-fc6d-475e-8dc0-6c5ea1904699/tasks/invalidGuid/metadata',
    );
    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(400);
  });

  it.each([408, 500, 501, 502, 503, 504])(
    '(GET) /executions/${workflow_instance_id}/tasks/${execution_id}/metadata when Monai gives general error',
    async (code) => {
      server.use(
        rest.get(
          `${testMonaiBasePath}/workflowinstances/a67a7af7-068b-44b8-a81b-def7b3e5403b`,
          (_req, res, ctx) => {
            return res(ctx.status(code));
          },
        ),
      );
      const response = await request(app.getHttpServer()).get(
        '/executions/a67a7af7-068b-44b8-a81b-def7b3e5403b/tasks/6b9d94b9-4285-45d4-bea9-491fa62b8f88/metadata',
      );
      expect(response.body).toMatchSnapshot();
      expect(response.statusCode).toBe(500);
    },
  );
});
