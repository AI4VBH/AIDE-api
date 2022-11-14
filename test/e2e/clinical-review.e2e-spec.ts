import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import * as request from 'supertest';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { HttpConfigService } from 'shared/http/http.service';
import AuthTokens from '../test_data/mocks/tokens/auth-tokens';
import ClinicalReviewMocks from '../test_data/mocks/clinical-review/clinical-reviews-index';
import { ClinicalReviewController } from 'modules/clinical-review/clinical-review.controller';
import { ClinicalReviewService } from 'modules/clinical-review/clinical-review.service';

const server = setupServer();
const testClinicalReviewServiceBasePath = 'https://localhost:7337';

describe('/Clinical-Review Integration Tests', () => {
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
              CLINICAL_REVIEW_SERVICE_HOST: testClinicalReviewServiceBasePath,
            }),
          ],
        }),
        // we register the HttpService with no stubbing! 🎉
        HttpModule.registerAsync({
          useClass: HttpConfigService,
        }),
      ],
      controllers: [ClinicalReviewController],
      providers: [ClinicalReviewService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it.each([
    ClinicalReviewMocks.clinicalReviewsList1,
    ClinicalReviewMocks.clinicalReviewsList2,
  ])('(GET) /clinical-review with returned data', async (clinicalreview) => {
    server.use(
      rest.get(
        `${testClinicalReviewServiceBasePath}/clinical-review?pageSize=10&pageNumber=1&roles=default-roles-aide%2Coffline_access%2Cadmin%2Cuma_authorization%2Cuser_management`,
        (request, response, context) => {
          return response(context.json(clinicalreview));
        },
      ),
    );
    const response = await request(app.getHttpServer())
      .get('/clinical-review?pageNumber=1&pageSize=10')
      .set('Authorization', AuthTokens.authtokenValidRolesUserid);

    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(200);
  });

  it.each([
    [
      AuthTokens.authtokenValidRolesUserid,
      'default-roles-aide,offline_access,admin,uma_authorization,user_management',
    ],
    [AuthTokens.authtokenValidRolesUserid2, 'admin'],
  ])('(GET) /clinical-review passes roles correctly', async (token, roles) => {
    let rolesParams;
    server.use(
      rest.get(
        `${testClinicalReviewServiceBasePath}/clinical-review?pageSize=10&pageNumber=1&roles=default-roles-aide%2Coffline_access%2Cadmin%2Cuma_authorization%2Cuser_management`,
        (request, response, context) => {
          rolesParams = request.url.searchParams.get('roles');
          return response(
            context.json(ClinicalReviewMocks.clinicalReviewsList1),
          );
        },
      ),
    );
    await request(app.getHttpServer())
      .get('/clinical-review?pageNumber=1&pageSize=10')
      .set('Authorization', token);
    expect(rolesParams).toBe(roles);
  });

  it('(GET) /clinical-review passes pagination correctly', async () => {
    let pageSizeParam;
    let pageNumberParam;
    server.use(
      rest.get(
        `${testClinicalReviewServiceBasePath}/clinical-review?pageSize=10&pageNumber=1&roles=default-roles-aide%2Coffline_access%2Cadmin%2Cuma_authorization%2Cuser_management`,
        (request, response, context) => {
          pageSizeParam = request.url.searchParams.get('pageSize');
          pageNumberParam = request.url.searchParams.get('pageNumber');
          return response(
            context.json(ClinicalReviewMocks.clinicalReviewsList1),
          );
        },
      ),
    );
    await request(app.getHttpServer())
      .get('/clinical-review?pageNumber=1&pageSize=10')
      .set('Authorization', AuthTokens.authtokenValidRolesUserid);
    expect(pageSizeParam).toBe('10');
    expect(pageNumberParam).toBe('1');
  });

  it('(GET) /clinical-review without returned data', async () => {
    server.use(
      rest.get(
        `${testClinicalReviewServiceBasePath}/clinical-review?pageSize=10&pageNumber=1&roles=default-roles-aide%2Coffline_access%2Cadmin%2Cuma_authorization%2Cuser_management`,
        (request, response, context) => {
          return response(
            context.json(ClinicalReviewMocks.clinicalReviewsListEmpty),
          );
        },
      ),
    );
    const response = await request(app.getHttpServer())
      .get('/clinical-review?pageNumber=1&pageSize=10')
      .set('Authorization', AuthTokens.authtokenValidRolesUserid);
    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(200);
  });

  it.each([408, 500, 501, 502, 503, 504])(
    '(GET) /clinical-review correct status when Clinical Review Service gives general error with code %s',
    async (code) => {
      server.use(
        rest.get(
          `${testClinicalReviewServiceBasePath}/clinical-review?pageSize=10&pageNumber=1&roles=default-roles-aide%2Coffline_access%2Cadmin%2Cuma_authorization%2Cuser_management`,
          (request, response, context) => {
            return response(context.status(code));
          },
        ),
      );
      const response = await request(app.getHttpServer())
        .get('/clinical-review?pageNumber=1&pageSize=10')
        .set('Authorization', AuthTokens.authtokenValidRolesUserid);

      expect(response.body).toMatchObject({
        message:
          'An error occurred with an external service (MONAI, Clinical Review)',
        statusCode: 500,
      });
      expect(response.status).toBe(500);
    },
  );

  it('(PUT) /clinical-review with body', async () => {
    server.use(
      rest.put(
        `${testClinicalReviewServiceBasePath}/clinical-review/684be698-bfa9-48ec-8ce6-37bd519ea234`,
        (request, response, context) => {
          return response(context.status(204));
        },
      ),
    );
    const response = await request(app.getHttpServer())
      .put('/clinical-review/684be698-bfa9-48ec-8ce6-37bd519ea234')
      .set('Authorization', AuthTokens.authtokenValidRolesUserid)
      .send(ClinicalReviewMocks.clinicalReviewsObject1);

    expect(response.status).toBe(204);
  });

  it.each([408, 500, 501, 502, 503, 504])(
    '(PUT) /clinical-review correct status when Clinical Review Service gives general error with code %s',
    async (code) => {
      server.use(
        rest.put(
          `${testClinicalReviewServiceBasePath}/clinical-review/684be698-bfa9-48ec-8ce6-37bd519ea234`,
          (request, response, context) => {
            return response(context.status(code));
          },
        ),
      );
      const response = await request(app.getHttpServer())
        .put('/clinical-review/684be698-bfa9-48ec-8ce6-37bd519ea234')
        .set('Authorization', AuthTokens.authtokenValidRolesUserid)
        .send(ClinicalReviewMocks.clinicalReviewsObject1);

      expect(response.body).toMatchObject({
        message:
          'An error occurred with an external service (MONAI, Clinical Review)',
        statusCode: 500,
      });
      expect(response.status).toBe(500);
    },
  );

  it('(PUT) /clinical-review 404 when review not found', async () => {
    server.use(
      rest.put(
        `${testClinicalReviewServiceBasePath}/clinical-review/684be698-bfa9-48ec-8ce6-37bd519ea234`,
        (request, response, context) => {
          return response(
            context.json(ClinicalReviewMocks.clinicalReviewsNotFoundError),
            context.status(404),
          );
        },
      ),
    );
    const response = await request(app.getHttpServer())
      .put('/clinical-review/684be698-bfa9-48ec-8ce6-37bd519ea234')
      .set('Authorization', AuthTokens.authtokenValidRolesUserid)
      .send(ClinicalReviewMocks.clinicalReviewsObject1);

    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(404);
  });

  it('(PUT) /clinical-review 400 when body invalid', async () => {
    server.use(
      rest.put(
        `${testClinicalReviewServiceBasePath}/clinical-review/684be698-bfa9-48ec-8ce6-37bd519ea234`,
        (request, response, context) => {
          return response(
            context.json(ClinicalReviewMocks.clinicalReviewsInvalidBodyError),
            context.status(400),
          );
        },
      ),
    );
    const response = await request(app.getHttpServer())
      .put('/clinical-review/684be698-bfa9-48ec-8ce6-37bd519ea234')
      .set('Authorization', AuthTokens.authtokenValidRolesUserid)
      .send(ClinicalReviewMocks.clinicalReviewsObject1);

    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(400);
  });

  it('(PUT) /clinical-review 400 when id invalid', async () => {
    server.use(
      rest.put(
        `${testClinicalReviewServiceBasePath}/clinical-review/invalid-id`,
        (request, response, context) => {
          return response(
            context.json(ClinicalReviewMocks.clinicalReviewIdInvalidError),
            context.status(400),
          );
        },
      ),
    );
    const response = await request(app.getHttpServer())
      .put('/clinical-review/invalid-id')
      .set('Authorization', AuthTokens.authtokenValidRolesUserid)
      .send(ClinicalReviewMocks.clinicalReviewsObject1);

    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(400);
  });

  it('(GET) /clinical-review-task-details with returned data (single study set)', async () => {
    server.use(
      rest.get(
        `${testClinicalReviewServiceBasePath}/task-details/12345?roles=default-roles-aide%2Coffline_access%2Cadmin%2Cuma_authorization%2Cuser_management`,
        (request, response, context) => {
          return response(
            context.json(
              ClinicalReviewMocks.clinicalReviewTaskDetailsSingleStudy,
            ),
          );
        },
      ),
    );
    const response = await request(app.getHttpServer())
      .get('/clinical-review/12345')
      .set('Authorization', AuthTokens.authtokenValidRolesUserid);

    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(200);
  });

  it('(GET) /clinical-review-task-details with returned data (multiple studies)', async () => {
    server.use(
      rest.get(
        `${testClinicalReviewServiceBasePath}/task-details/12345?roles=default-roles-aide%2Coffline_access%2Cadmin%2Cuma_authorization%2Cuser_management`,
        (request, response, context) => {
          return response(
            context.json(ClinicalReviewMocks.clinicalReviewTaskDetails),
          );
        },
      ),
    );
    const response = await request(app.getHttpServer())
      .get('/clinical-review/12345')
      .set('Authorization', AuthTokens.authtokenValidRolesUserid);

    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(200);
  });

  it.each([
    [
      AuthTokens.authtokenValidRolesUserid,
      'default-roles-aide,offline_access,admin,uma_authorization,user_management',
    ],
    [AuthTokens.authtokenValidRolesUserid2, 'admin'],
  ])(
    '(GET) /clinical-review-task-details passes roles correctly',
    async (token, roles) => {
      let rolesParams;
      server.use(
        rest.get(
          `${testClinicalReviewServiceBasePath}/task-details/12345?roles=default-roles-aide%2Coffline_access%2Cadmin%2Cuma_authorization%2Cuser_management`,
          (request, response, context) => {
            rolesParams = request.url.searchParams.get('roles');
            return response(
              context.json(ClinicalReviewMocks.clinicalReviewTaskDetails),
            );
          },
        ),
      );
      await request(app.getHttpServer())
        .get('/clinical-review/12345')
        .set('Authorization', token);
      expect(rolesParams).toBe(roles);
    },
  );

  it.each([408, 500, 501, 502, 503, 504])(
    '(GET) /clinical-review-task-details correct status when Clinical Review Service cannot be connected to %s',
    async (code) => {
      server.use(
        rest.get(
          `${testClinicalReviewServiceBasePath}/task-details/12345?roles=default-roles-aide%2Coffline_access%2Cadmin%2Cuma_authorization%2Cuser_management`,
          (request, response, context) => {
            return response(context.status(code));
          },
        ),
      );

      const response = await request(app.getHttpServer())
        .get('/clinical-review/12345')
        .set('Authorization', AuthTokens.authtokenValidRolesUserid);

      expect(response.body).toMatchObject({
        message:
          'An error occurred with an external service (MONAI, Clinical Review)',
        statusCode: 500,
      });
      expect(response.status).toBe(500);
    },
  );

  it('(GET) /clinical-review-task-details returns Bad Request when roles have not been provided', async () => {
    server.use(
      rest.get(
        `${testClinicalReviewServiceBasePath}/task-details/12345`,
        (request, response, context) => {
          return response(context.status(400));
        },
      ),
    );

    const response = await request(app.getHttpServer()).get(
      '/clinical-review/12345',
    );

    expect(response.status).toBe(400);
  });

  it('(GET) /clinical-review-task-details correct status when Task Id is not found', async () => {
    server.use(
      rest.get(
        `${testClinicalReviewServiceBasePath}/task-details/12345?roles=default-roles-aide%2Coffline_access%2Cadmin%2Cuma_authorization%2Cuser_management`,
        (request, response, context) => {
          return response(
            context.json(ClinicalReviewMocks.clinicalReviewTaskDetailsError),
            context.status(404),
          );
        },
      ),
    );

    const response = await request(app.getHttpServer())
      .get('/clinical-review/12345')
      .set('Authorization', AuthTokens.authtokenValidRolesUserid);

    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(404);
  });

  it.each([401, 403])(
    '(GET) /clinical-review-task-details correct status when unauthorised being returned from the Clinical Service',
    async (code) => {
      server.use(
        rest.get(
          `${testClinicalReviewServiceBasePath}/task-details/12345?roles=default-roles-aide%2Coffline_access%2Cadmin%2Cuma_authorization%2Cuser_management`,
          (request, response, context) => {
            return response(context.status(code));
          },
        ),
      );

      const response = await request(app.getHttpServer())
        .get('/clinical-review/12345')
        .set('Authorization', AuthTokens.authtokenValidRolesUserid);

      expect(response.status).toBe(code);
    },
  );
});
