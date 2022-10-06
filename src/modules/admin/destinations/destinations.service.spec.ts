import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosInstance } from 'axios';
import { makeObservableForTest } from 'test/utilities/test-make-observable';
import { IDestination } from './destinations.interface';
import { DestinationsService } from './destinations.service';

describe('DestinationsService', () => {
  let configServiceMock: DeepMocked<ConfigService>;
  let axios: DeepMocked<AxiosInstance>;
  let httpService: DeepMocked<HttpService>;
  let destinationsService: DestinationsService;

  beforeEach(async () => {
    configServiceMock = createMock<ConfigService>();
    axios = createMock<AxiosInstance>();
    httpService = createMock<HttpService>({
      axiosRef: axios,
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DestinationsService,
        { provide: HttpService, useValue: httpService },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();

    destinationsService = module.get<DestinationsService>(DestinationsService);
  });

  it('should be defined', () => {
    expect(destinationsService).toBeDefined();
  });

  describe('getDestinations', () => {
    it('returns expected result', async () => {
      const destinations = [
        {
          port: 104,
          name: 'USEAST',
          aeTitle: 'PACSUSEAST',
          hostIp: '10.20.3.4',
        },
        {
          port: 104,
          name: 'USWEST',
          aeTitle: 'PACSUSWEST',
          hostIp: '10.50.3.4',
        },
      ] as IDestination[];
      axios.get.mockResolvedValue({
        status: 200,
        data: destinations,
      });
      httpService.get.mockReturnValue(makeObservableForTest(axios.get));

      const response = await destinationsService.getDestinations();

      expect(httpService.get).toHaveBeenCalled();
      expect(response).toMatchSnapshot();
      expect(response).toEqual(destinations);
    });
  });
});
