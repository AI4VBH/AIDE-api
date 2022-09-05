import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
require('./mocks/payloads');

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/payloads tests', () => {

    jest.mock('./../src/app.module', () => ({
      payloads: jest.fn()
    }));

    it('GET /payloads with returned data', () => {
      //mock with data driven
      test.each`
        mock                        |   
        ${"basic-payload-1.json"}   |
        ${"basic-payload-2.json"}   |
        ${"basic-payload-3.json"}   |`
      AppModule.payloads.mockResolvedValue('$mock')
      return request(app.getHttpServer())
        .get('/payloads')
        .expect(200);
        //expect how the data should be laid out
    });
  
    it('GET /payloads without returned data', () => {
      AppModule.payloads.mockResolvedValue('empty-data.js')
      return request(app.getHttpServer())
      //mock empty response
        .get('/payloads')
        .expect(200)
        .expect('"data":[]');
    });
  
    it('GET /payloads when Monai doesnt respond', () => {
      AppModule.payloads.mockRejectedValueOnce(new Error('Connection Failed or something'))
      return request(app.getHttpServer())
            //mock 500 response
        .get('/payloads')
        .expect(400)
        .expect('Decent error message');
    });

    it('GET /payloads passes through pagination query', () => {
      // Make data driven
      test.each`
        paginationQuery                        |   
        ${"?pageNumber=1&pageSize=10"}   |
        ${"?pageNumber=10&pageSize=1"}   |
        ${"?pageNumber=1&pageSize=5"}   |`
      return request(app.getHttpServer())
        .get('/payloads' + '$paginationQuery')
        .expect(200);
        //expect how the data should be laid out
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
