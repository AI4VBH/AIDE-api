import { createMock, DeepMocked } from "@golevelup/ts-jest";
import { HttpService } from "@nestjs/axios";
import { Test, TestingModule } from "@nestjs/testing";
import { of } from "rxjs";
import { PayloadsService } from "./payloads.service";
import * as mockMonaiPayloadsResponse from 'test/test_data/mocks/payloads/basic-payload-1.json';

describe('PayloadsService', () => {
    let httpService: DeepMocked<HttpService>;
    let service: PayloadsService;

    beforeEach(async () => {
        httpService = createMock<HttpService>();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PayloadsService,
                {
                    provide: HttpService,
                    useValue: httpService
                }
            ]
        }).compile();

        service = module.get<PayloadsService>(
            PayloadsService
        );
    });

    it('should be defined', () => expect(service).toBeDefined());

    describe('getPayloads', () => {
        it('throws an error if the monai request is unsuccessful', async () => {
            jest
                .spyOn(httpService, 'get')
                .mockImplementation(() => of({
                    status: 404,
                    statusText: "",
                    config: {},
                    headers: {},
                    data: {
                        succeeded: false,
                        errors: ['Example error message 1', 'Example error message 2']
                    },
                }));

            const action = async () => await service.getPayloads({ pageNumber: '1', pageSize: '10' });

            await expect(action()).rejects.toThrowError(Error);
        });

        it('returns the expected result', async () => {
            const expectedResult = {
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
            };

            jest
                .spyOn(httpService, 'get')
                .mockImplementation(() => of({
                    status: 200,
                    statusText: "Success",
                    config: {},
                    headers: {},
                    data: mockMonaiPayloadsResponse,
                }));

            const response = await service.getPayloads({ pageNumber: '1', pageSize: '10' });

            expect(response).toEqual(expectedResult);
        });
    });
});
