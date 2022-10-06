import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosInstance } from 'axios';
import { makeObservableForTest } from 'test/utilities/test-make-observable';
import { IDestination } from './destinations.interface';
import { DestinationsService } from './destinations.service';

describe('DestinationsService', () => {
  let axios: DeepMocked<AxiosInstance>;
  let httpService: DeepMocked<HttpService>;
  let configService: DeepMocked<ConfigService>;
  let destinationsService: DestinationsService;

  beforeEach(async () => {
    configService = createMock<ConfigService>();
    axios = createMock<AxiosInstance>();
    httpService = createMock<HttpService>({
      axiosRef: axios,
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DestinationsService,
        {
          provide: HttpService,
          useValue: httpService,
        },
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    destinationsService = module.get<DestinationsService>(DestinationsService);
  });

  it('should be defined', () => expect(destinationsService).toBeDefined());

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

    describe('echoDestination', () => {
      it('throws an error if the mig request is unsuccessful', async () => {
        axios.get.mockResolvedValue({ status: 404 });

        httpService.get.mockReturnValue(makeObservableForTest(axios.get));

        const action = async () => await destinationsService.echoDestination('test');

        await expect(action()).rejects.toThrowError();
        expect(httpService.get).toHaveBeenCalled();
      });

      it('returns the expected response', async () => {
        axios.get.mockResolvedValue({ status: 200 });

        httpService.get.mockReturnValue(makeObservableForTest(axios.get));

        const response = await destinationsService.echoDestination('test');

        expect(response).toMatchSnapshot();
      });
    });

    describe('registerDestination', () => {
      it('throw error if the mig request is unsuccessful', async () => {
        axios.post.mockResolvedValue({ status: 404 });

        httpService.post.mockReturnValue(makeObservableForTest(axios.post));

        const action = async () =>
          await destinationsService.registerDestination({
            aeTitle: 'testing ae title',
            port: 3456,
            hostIp: 'example.host.ip',
            name: 'example name',
          });

        await expect(action()).rejects.toThrowError();
        expect(httpService.post).toHaveBeenCalled();
      });

      it('returns the expected result', async () => {
        axios.post.mockResolvedValue({
          status: 201,
          statusText: 'Created',
          config: {},
          headers: {},
          data: {
            aeTitle: 'testing ae title',
            port: 3456,
            hostIp: 'example.host.ip',
            name: 'example name',
          },
        });

        httpService.post.mockReturnValue(makeObservableForTest(axios.post));

        const response = await destinationsService.registerDestination({
          aeTitle: 'testing ae title',
          port: 3456,
          hostIp: 'example.host.ip',
          name: 'example name',
        });

        expect(response).toMatchSnapshot();
      });
    });

    describe('updateDestination', () => {
      it('throws error if the mig request is unsuccessful', async () => {
        axios.put.mockResolvedValue({ status: 404 });

        httpService.put.mockReturnValue(makeObservableForTest(axios.put));

        const action = async () =>
          await destinationsService.updateDestination({
            aeTitle: 'testing ae title',
            port: 3456,
            hostIp: 'example.host.ip',
            name: 'example name',
          });

        await expect(action()).rejects.toThrowError();
        expect(httpService.put).toHaveBeenCalled();
      });

      it('returns the expected result', async () => {
        axios.put.mockResolvedValue({
          status: 200,
          statusText: 'Updated',
          config: {},
          headers: {},
          data: {
            aeTitle: 'testing ae title',
            port: 3456,
            hostIp: 'example.host.ip',
            name: 'example name',
          },
        });

        httpService.put.mockReturnValue(makeObservableForTest(axios.put));

        const response = await destinationsService.updateDestination({
          aeTitle: 'testing ae title',
          port: 3456,
          hostIp: 'example.host.ip',
          name: 'example name',
        });

        expect(response).toMatchSnapshot();
      });
    });
  });
});
