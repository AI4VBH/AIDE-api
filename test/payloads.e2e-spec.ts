import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import * as request from 'supertest';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { AxiosInstance } from 'axios';
import { PayloadsController } from 'modules/admin/payloads/payloads.controller';
import { PayloadsService } from 'modules/admin/payloads/payloads.service';
import { createObservableResponse } from './utilities/http-helpers';

describe('Payloads Controller', () => {
  let app: INestApplication;
  let axiosMock: DeepMocked<AxiosInstance>;
  let httpServiceMock: DeepMocked<HttpService>;
  let configServiceMock: DeepMocked<ConfigService>;

  beforeEach(async () => {
    axiosMock = createMock<AxiosInstance>();
    httpServiceMock = createMock<HttpService>({
      axiosRef: axiosMock,
    });
    configServiceMock = createMock<ConfigService>({
      get: (path) => path === 'MONAI_API_HOST' && 'http://localhost:7337',
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [PayloadsController],
      providers: [
        {
          provide: HttpService,
          useValue: httpServiceMock,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
        PayloadsService,
      ],
    })
      // .overrideProvider(HttpService)
      // .useValue(httpServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('(GET) /payloads', () => {
    axiosMock.get.mockResolvedValue({ status: 404 });
    httpServiceMock.get.mockResolvedValue(
      createObservableResponse(axiosMock.get),
    );

    return request(app.getHttpServer())
      .get('/payloads?pageNumber=1&pageSize=10')
      .expect(200)
      .expect('test');
  });
});
