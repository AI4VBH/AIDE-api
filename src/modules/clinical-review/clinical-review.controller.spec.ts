/*
 * Copyright 2022 Guy’s and St Thomas’ NHS Foundation Trust
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { BadRequestException, HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ClinicalReviewController } from './clinical-review.controller';
import { ClinicalReviewAcknowledge } from './clinical-review.interfaces';
import { ClinicalReviewService } from './clinical-review.service';

describe('ClinicalReviewController', () => {
  let controller: ClinicalReviewController;
  let clinicalReviewService: DeepMocked<ClinicalReviewService>;

  beforeEach(async () => {
    clinicalReviewService = createMock<ClinicalReviewService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClinicalReviewController],
      providers: [
        {
          provide: ClinicalReviewService,
          useValue: clinicalReviewService,
        },
      ],
    }).compile();

    controller = module.get<ClinicalReviewController>(ClinicalReviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('acknowledgeClinicalReview', () => {
    it('passes the workflow to service', async () => {
      const body: ClinicalReviewAcknowledge = {
        acceptance: true,
        reason: 'all good',
        message: 'message',
        roles: [],
        userId: '',
      };

      const clinicalReviewId = 'clinical-review-id';
      const roles = ['admin', 'clinician'];
      const userId = 'testuser@gmail.com';

      await controller.acknowledgeClinicalReview(
        clinicalReviewId,
        body,
        roles,
        userId,
      );

      expect(
        clinicalReviewService.acknowledgeClinicalReview,
      ).toHaveBeenCalledWith(body, roles, userId, clinicalReviewId);
    });
  });

  describe('getClinicalReviews', () => {
    it('passes the default pageNumber and pageSize to service', async () => {
      await controller.getClinicalReviews(['admin']);

      expect(clinicalReviewService.getClinicalReviews).toHaveBeenCalledWith({
        pageNumber: 1,
        pageSize: 10,
        roles: ['admin'],
        applicationName: '',
        patientId: '',
        patientName: '',
      });
    });

    it.each([
      [0, 10],
      [-1, 10],
      [1, 0],
      [1, -1],
      [0, 0],
    ])(
      'throws exception when query params are invalid: pageNumber = %s, pageSize = %d',
      async (pageNumber, pageSize) => {
        const action = async () =>
          await controller.getClinicalReviews(['admin'], pageNumber, pageSize);

        await expect(action).rejects.toThrow(BadRequestException);
      },
    );

    it('throws exception when no roles are found', async () => {
      const action = async () =>
        await controller.getClinicalReviews(null, 2, 10);

      await expect(action).rejects.toThrow(BadRequestException);
    });

    it('passes the pageNumber and pageSize to service', async () => {
      await controller.getClinicalReviews(['admin'], 2, 10);

      expect(clinicalReviewService.getClinicalReviews).toHaveBeenCalledWith({
        pageNumber: 2,
        pageSize: 10,
        roles: ['admin'],
        applicationName: '',
        patientId: '',
        patientName: '',
      });
    });
  });

  describe('getClinicalReviewTaskDetails', () => {
    it('passes the id to service', async () => {
      const taskId = '123';
      const roles = ['clinician'];
      await controller.getClinicalReviewTaskDetails(roles, taskId);

      expect(
        clinicalReviewService.getClinicalReviewTaskDetails,
      ).toHaveBeenCalledWith(roles, taskId);
    });

    it('throws unauthorised exception when no roles are found', async () => {
      const action = async () =>
        await controller.getClinicalReviewTaskDetails(null, '123');

      await expect(action).rejects.toThrowError(HttpException);
    });
  });

  describe('GetDicomFile', () => {
    it('passes the key to service', async () => {
      const key = '123abc';
      const roles = ['clinician'];
      await controller.getDicomFile(roles, key);

      expect(clinicalReviewService.getDicomFile).toHaveBeenCalledWith(
        roles,
        key,
      );
    });
  });
});
