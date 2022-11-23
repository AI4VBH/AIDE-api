import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import * as request from 'supertest';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { HttpConfigService } from 'shared/http/http.service';
import { DestinationsController } from 'modules/admin/destinations/destinations.controller';
import { DestinationsService } from 'modules/admin/destinations/destinations.service';
import DestinationsMock from '../test_data/mocks/destinations/destinations-index';

const server = setupServer();
const testMonaiBasePath = 'https://localhost:7337';
const testMigBasePath = 'https://localhost:7338';

describe('/destinations Integration Tests', () => {
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
              MIG_API_HOST: testMigBasePath,
            }),
          ],
        }),
        HttpModule.registerAsync({
          useClass: HttpConfigService,
        }),
      ],
      controllers: [DestinationsController],
      providers: [DestinationsService],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  it('(GET) /destinations no destinations', async () => {
    server.use(
      rest.get(`${testMigBasePath}/config/destination`, (_req, res, ctx) => {
        return res(ctx.json([]));
      }),
    );
    const response = await request(app.getHttpServer()).get('/destinations');
    expect(response.body).toMatchObject([]);
    expect(response.statusCode).toBe(200);
  });

  it.each([
    DestinationsMock.destinationsList1,
    DestinationsMock.destinationsList2,
  ])('(GET) /destinations with destinations', async (...destinations) => {
    server.use(
      rest.get(`${testMigBasePath}/config/destination`, (_req, res, ctx) => {
        return res(ctx.json(destinations));
      }),
    );
    const response = await request(app.getHttpServer()).get('/destinations');
    expect(response.body).toMatchSnapshot();
    expect(response.statusCode).toBe(200);
  });

  it.each([408, 500, 501, 502, 503, 504])(
    '(GET) /destinations correct status when MIG gives general error with code %s',
    async (code) => {
      server.use(
        rest.get(`${testMigBasePath}/config/destination`, (_req, res, ctx) => {
          return res(ctx.status(code));
        }),
      );
      const response = await request(app.getHttpServer()).get('/destinations');
      expect(response.body).toMatchObject({
        message:
          'An error occurred with an external service (MONAI, Clinical Review)',
        statusCode: 500,
      });
      expect(response.statusCode).toBe(500);
    },
  );

  it('(POST) /destinations/ with body', async () => {
    server.use(
      rest.post(`${testMigBasePath}/config/destination`, (req, res, ctx) => {
        return res(
          ctx.status(201),
          ctx.json(DestinationsMock.destinationsObject1),
        );
      }),
    );
    const response = await request(app.getHttpServer())
      .post('/destinations')
      .send(DestinationsMock.destinationsObject1);
    expect(response.body).toMatchSnapshot();
    expect(response.statusCode).toBe(201);
  });

  it('(DELETE) /destinations/ with url param', async () => {
    server.use(
      rest.delete(
        `${testMigBasePath}/config/destination/Lillie`,
        (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json(DestinationsMock.destinationsObject1),
          );
        },
      ),
    );
    const response = await request(app.getHttpServer()).delete(
      '/destinations/Lillie',
    );
    expect(response.body).toMatchSnapshot();
    expect(response.statusCode).toBe(200);
  });

  it.each([
    DestinationsMock.destinationsObjectMissingAeTitle,
    DestinationsMock.destinationsObjectMissingName,
    DestinationsMock.destinationsObjectMissingPort,
    DestinationsMock.destinationsMissingHostIp,
    DestinationsMock.destinationsObjectEmpty,
  ])('(POST) /destinations/ Invalid body', async (destinationBody) => {
    server.use(
      rest.post(`${testMigBasePath}/config/destination`, (req, res, ctx) => {
        return res(ctx.status(400), ctx.json(destinationBody));
      }),
    );
    const response = await request(app.getHttpServer())
      .post(`/destinations`)
      .send(destinationBody);
    expect(response.body).toMatchSnapshot();
    expect(response.statusCode).toBe(400);
  });

  it.each([408, 500, 501, 502, 503, 504])(
    '(POST) /destination/:name correct status when MIG gives general error with code %s',
    async (code) => {
      server.use(
        rest.post(`${testMigBasePath}/config/destination`, (_req, res, ctx) => {
          return res(ctx.status(code));
        }),
      );
      const response = await request(app.getHttpServer())
        .post(`/destinations`)
        .send(DestinationsMock.destinationsObject1);
      expect(response.body).toMatchObject({
        message:
          'An error occurred with an external service (MONAI, Clinical Review)',
        statusCode: 500,
      });
      expect(response.statusCode).toBe(500);
    },
  );

  it('(PUT) /destinations/:name with body', async () => {
    server.use(
      rest.put(`${testMigBasePath}/config/destination`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(DestinationsMock.destinationsObject1),
        );
      }),
    );
    const response = await request(app.getHttpServer())
      .put('/destinations/ORTHANC')
      .send(DestinationsMock.destinationsObject1);
    expect(response.body).toMatchSnapshot();
    expect(response.statusCode).toBe(200);
  });

  it.each([408, 500, 501, 502, 503, 504])(
    '(PUT) /destinations/:name correct status when MIG gives general error with code %s',
    async (code) => {
      server.use(
        rest.put(`${testMigBasePath}/config/destination`, (_req, res, ctx) => {
          return res(ctx.status(code));
        }),
      );
      const response = await request(app.getHttpServer())
        .put('/destinations/ORTHANC')
        .send(DestinationsMock.destinationsObject1);
      expect(response.body).toMatchObject({
        message:
          'An error occurred with an external service (MONAI, Clinical Review)',
        statusCode: 500,
      });
      expect(response.statusCode).toBe(500);
    },
  );

  it.each([
    DestinationsMock.destinationsObjectMissingAeTitle,
    DestinationsMock.destinationsObjectMissingName,
    DestinationsMock.destinationsObjectMissingPort,
    DestinationsMock.destinationsMissingHostIp,
    DestinationsMock.destinationsObjectEmpty,
  ])('(PUT) /destinations/:name Invalid body', async (destinationBody) => {
    server.use(
      rest.put(`${testMigBasePath}/config/destination`, (req, res, ctx) => {
        return res(ctx.status(400), ctx.json(destinationBody));
      }),
    );
    const response = await request(app.getHttpServer())
      .put(`/destinations/ORTHANC`)
      .send(destinationBody);
    expect(response.body).toMatchSnapshot();
    expect(response.statusCode).toBe(400);
  });

  it('(PUT) /destinations/:name changed name', async () => {
    server.use(
      rest.put(`${testMigBasePath}/config/destination`, (req, res, ctx) => {
        return res(
          ctx.status(404),
          ctx.json(DestinationsMock.destinationsError404),
        );
      }),
    );
    const response = await request(app.getHttpServer())
      .put('/destinations/ORTHANC')
      .send(DestinationsMock.destinationsObject1);
    expect(response.body).toMatchSnapshot();
    expect(response.statusCode).toBe(404);
  });

  it.each([408, 500, 501, 502, 503, 504])(
    '(PUT) /destination/:name correct status when MIG gives general error with code %s',
    async (code) => {
      server.use(
        rest.put(`${testMigBasePath}/config/destination`, (_req, res, ctx) => {
          return res(ctx.status(code));
        }),
      );
      const response = await request(app.getHttpServer())
        .put(`/destinations/ORTHANC`)
        .send(DestinationsMock.destinationsObject1);
      expect(response.body).toMatchObject({
        message:
          'An error occurred with an external service (MONAI, Clinical Review)',
        statusCode: 500,
      });
      expect(response.statusCode).toBe(500);
    },
  );

  it('(GET) /destinations/echo/:name successfully dicom echo a destination', async () => {
    const name = 'ORTHANC';
    server.use(
      rest.get(
        `${testMigBasePath}/config/destination/cecho/${name}`,
        (_req, res, ctx) => {
          return res(ctx.status(200));
        },
      ),
    );
    const response = await request(app.getHttpServer()).get(
      `/destinations/echo/${name}`,
    );
    expect(response.statusCode).toBe(200);
  });

  it('(GET) /destinations/echo/:name dicom echo a missing destination ', async () => {
    const name = 'missing';
    server.use(
      rest.get(
        `${testMigBasePath}/config/destination/cecho/${name}`,
        (_req, res, ctx) => {
          return res(
            ctx.status(404),
            ctx.json(DestinationsMock.destinationsError404),
          );
        },
      ),
    );
    const response = await request(app.getHttpServer()).get(
      `/destinations/echo/${name}`,
    );
    expect(response.body).toMatchSnapshot();
    expect(response.statusCode).toBe(404);
  });

  it.each([408, 500, 501, 502, 503, 504])(
    '(GET) /destinations correct status when MIG gives general error with code %s',
    async (code) => {
      const name = 'ORTHANC';
      server.use(
        rest.get(
          `${testMigBasePath}/config/destination/cecho/${name}`,
          (_req, res, ctx) => {
            return res(ctx.status(code));
          },
        ),
      );
      const response = await request(app.getHttpServer()).get(
        `/destinations/echo/${name}`,
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
