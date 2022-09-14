import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'app.module';
import { PayloadsService } from 'modules/admin/payloads/payloads.service';
import { HttpService } from '@nestjs/axios';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
// require('./mocks/payloads');

jest.mock('./../src/modules/admin/payloads/payloads.service');

describe.only('AppController (e2e)', () => {
  let app: INestApplication;
  let payloadsService: DeepMocked<PayloadsService>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    payloadsService = createMock<PayloadsService>();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/payloads tests', () => {


    it('GET /payloads with returned data', () => {
      //mock with data driven
      // test.each`
      //   mock                        |   
      //   ${"basic-payload-1.json"}   |
      //   ${"basic-payload-2.json"}   |
      //   ${"basic-payload-3.json"}   |`
      // jest.spyOn(payloadsService, 'getPayloads').mockResolvedValue();
      payloadsService.getPayloads.mockResolvedValue(Promise.resolve({
        pageNumber: 1,
        pageSize: 10,
        firstPage: "//payload?pageNumber=1&pageSize=10",
        lastPage: "//payload?pageNumber=1&pageSize=10",
        totalPages: 1,
        totalRecords: 3,
        nextPage: null,
        previousPage: null,
        data: [
            {
                payload_id: "86c0f117-4021-412e-b163-0dc621df672a",
                patient_id: "1d0253c4-8fab-41df-a414-55d52e4c6c3f",
                patient_name: "Jane Doe",
                payload_received: "2022-08-17T12:21:10.203Z",
            },
            {
                payload_id: "30a8e0c6-e6c4-458f-aa4d-b224b493d3c0",
                patient_id: "",
                patient_name: "",
                payload_received: "2022-08-17T12:21:10.203Z",
            },
            {
                payload_id: "c5c3636b-81dd-44a9-8c4b-71adec7d47b2",
                patient_id: "fd1bebf4-d690-4fc5-a0d8-4fd4701ff4c9",
                patient_name: "Steve Jobs",
                payload_received: "2022-08-17T12:21:10.2Z",
            }
        ]
    }));
      return request(app.getHttpServer())
        .get('/payloads?pageNumber=1&pageSize=10')
        .expect(200)
        .expect("test");
        //expect how the data should be laid out
    });
  
  //   it('GET /payloads without returned data', () => {
  //     AppModule.payloads.mockResolvedValue('empty-data.js')
  //     return request(app.getHttpServer())
  //     //mock empty response
  //       .get('/payloads')
  //       .expect(200)
  //       .expect('"data":[]');
  //   });
  
  //   it('GET /payloads when Monai doesnt respond', () => {
  //     AppModule.payloads.mockRejectedValueOnce(new Error('Connection Failed or something'))
  //     return request(app.getHttpServer())
  //           //mock 400 response
  //       .get('/payloads')
  //       .expect(400)
  //       .expect('Decent error message');
  //   });

  //   it('GET /payloads passes through pagination query', () => {
  //     // Make data driven
  //     test.each`
  //       paginationQuery                        |   
  //       ${"?pageNumber=1&pageSize=10"}   |
  //       ${"?pageNumber=10&pageSize=1"}   |
  //       ${"?pageNumber=1&pageSize=5"}   |`
  //     return request(app.getHttpServer())
  //       .get('/payloads' + '$paginationQuery')
  //       .expect(200);
  //       //expect how the data should be laid out
  //   });
  });

  afterAll(async () => {
    await app.close();
  });
});
