import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

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
    it('GET /payloads with returned data', () => {
      //mock with data driven
      return request(app.getHttpServer())
        .get('/payloads')
        .expect(200);
    });
  
    it('GET /payloads without returned data', () => {
      return request(app.getHttpServer())
      //mock empty response
        .get('/payloads')
        .expect(200);
    });
  
    it('GET /payloads when Monai doesnt respond', () => {
      return request(app.getHttpServer())
            //mock 500 response
        .get('/payloads')
        .expect(500)
        .expect('Decent error message');
    });

    it('GET /payloads passes through pagination query', () => {
      // Make data driven
      return request(app.getHttpServer())
        .get('/payloads?pageNumber=1&pageSize=10')
        .expect(200);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
