import { createMock, DeepMocked } from "@golevelup/ts-jest";
import { HttpService } from "@nestjs/axios";
import { InternalServerErrorException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { of } from "rxjs";
import { PayloadsService } from "./payloads.service";

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

        service = module.get<PayloadsService>(PayloadsService);
    });

    it('should be defined', () => expect(service).toBeDefined());

    describe('getPayloads', () => {
        it('returns a server error if nothing is returned from the monai request', async () => {
            httpService.get.mockResolvedValue(of(null) as never);

            const response = await service.getPayloads({ pageNumber: 1, pageSize: 10 });

            expect(response).rejects.toThrowError(InternalServerErrorException);
        });
    });
});
