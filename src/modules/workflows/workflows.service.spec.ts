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
import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosInstance } from 'axios';
import { RolesService } from 'modules/roles/roles.service';
import { makeObservableForTest } from '../../../test/utilities/test-make-observable';
import { Destination, PagedMonaiWorkflows } from './monai-workflow.interfaces';
import { WorkflowsService } from './workflows.service';

describe('WorkflowsService', () => {
  let axios: DeepMocked<AxiosInstance>;
  let httpService: DeepMocked<HttpService>;
  let configService: DeepMocked<ConfigService>;
  let rolesService: DeepMocked<RolesService>;

  let service: WorkflowsService;

  beforeEach(async () => {
    axios = createMock<AxiosInstance>();
    httpService = createMock<HttpService>({
      axiosRef: axios,
    });
    configService = createMock<ConfigService>();
    rolesService = createMock<RolesService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkflowsService,
        {
          provide: HttpService,
          useValue: httpService,
        },
        {
          provide: ConfigService,
          useValue: configService,
        },
        {
          provide: RolesService,
          useValue: rolesService,
        },
        {
          provide: Logger,
          useFactory: () => createMock<Logger>(),
        },
      ],
    }).compile();

    service = module.get<WorkflowsService>(WorkflowsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPagedWorkflows', () => {
    it('returns expected result', async () => {
      const monaiResult: PagedMonaiWorkflows = {
        totalPages: 1,
        totalRecords: 1,
        pageNumber: 1,
        pageSize: 10,
        firstPage: '/page-1',
        lastPage: '/page-1',
        nextPage: null,
        previousPage: null,
        data: [],
      };

      axios.get.mockResolvedValue({
        status: 200,
        data: monaiResult,
      });

      httpService.get.mockReturnValue(makeObservableForTest(axios.get));

      const result = await service.getPagedWorkflows(1, 10);

      expect(result).toMatchSnapshot();
    });
  });

  describe('createWorkflow', () => {
    it('returns expected result', async () => {
      const workflow = {
        informatics_gateway: {
          ae_title: 'monai',
          export_destinations: ['TESTDEST', 'TESTDEST2'],
        },
      };

      const destinations = [
        {
          port: 100,
          name: 'TESTDEST',
          aeTitle: 'TESTDEST',
          hostIp: '3.2.1.5',
        },
        {
          port: 101,
          name: 'TESTDEST2',
          aeTitle: 'TESTDEST2',
          hostIp: '3.2.1.58',
        },
      ] as Destination[];

      axios.post.mockResolvedValueOnce({
        status: 201,
      });

      axios.get.mockResolvedValueOnce({
        status: 200,
        data: destinations,
      });

      axios.post.mockResolvedValue({
        status: 200,
        data: workflow,
      });

      httpService.post.mockReturnValue(makeObservableForTest(axios.post));
      httpService.get.mockReturnValue(makeObservableForTest(axios.get));

      const result = await service.createWorkflow(workflow);

      expect(result).toMatchSnapshot();
    });

    it('valid reviewer roles returns expected result', async () => {
      const workflow = {
        informatics_gateway: {
          ae_title: 'monai',
          export_destinations: ['TESTDEST', 'TESTDEST2'],
        },
        tasks: [
          {
            id: 'clinical-review-task',
            type: 'aide_clinical_review',
            args: { reviewer_roles: 'clinician, admin' },
          },
        ],
      };

      const destinations = [
        {
          port: 100,
          name: 'TESTDEST',
          aeTitle: 'TESTDEST',
          hostIp: '3.2.1.5',
        },
        {
          port: 101,
          name: 'TESTDEST2',
          aeTitle: 'TESTDEST2',
          hostIp: '3.2.1.58',
        },
      ] as Destination[];

      axios.post.mockResolvedValueOnce({
        status: 201,
      });

      axios.get.mockResolvedValueOnce({
        status: 200,
        data: destinations,
      });

      axios.post.mockResolvedValue({
        status: 200,
        data: workflow,
      });

      rolesService.getAllRoles.mockResolvedValue([
        {
          id: 'roleid',
          name: 'admin',
          editable: false,
        },
        {
          id: 'roleid2',
          name: 'clinician',
          editable: false,
        },
      ]);

      httpService.post.mockReturnValue(makeObservableForTest(axios.post));
      httpService.get.mockReturnValue(makeObservableForTest(axios.get));

      const result = await service.createWorkflow(workflow);

      expect(result).toMatchSnapshot();
    });

    it('aeTitle exists returns expected result', async () => {
      const workflow = {
        informatics_gateway: {
          ae_title: 'monai',
          export_destinations: ['TESTDEST', 'TESTDEST2'],
        },
      };

      const destinations = [
        {
          port: 100,
          name: 'TESTDEST',
          aeTitle: 'TESTDEST',
          hostIp: '3.2.1.5',
        },
        {
          port: 101,
          name: 'TESTDEST2',
          aeTitle: 'TESTDEST2',
          hostIp: '3.2.1.58',
        },
      ] as Destination[];

      axios.post.mockResolvedValueOnce({
        status: 409,
      });

      axios.get.mockResolvedValueOnce({
        status: 200,
        data: destinations,
      });

      axios.post.mockResolvedValue({
        status: 200,
        data: workflow,
      });

      httpService.post.mockReturnValue(makeObservableForTest(axios.post));
      httpService.get.mockReturnValue(makeObservableForTest(axios.get));

      const result = await service.createWorkflow(workflow);

      expect(result).toMatchSnapshot();
    });

    it('missing aeTitle throws error', async () => {
      const workflow = {
        informatics_gateway: {
          export_destinations: ['TESTDEST', 'TESTDEST2'],
        },
      };

      await expect(
        service.createWorkflow(workflow),
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it('clinical review reviewer_roles missing in keycloak throws error', async () => {
      const workflow = {
        informatics_gateway: {
          export_destinations: ['TESTDEST', 'TESTDEST2'],
        },
        tasks: [
          {
            id: 'clinical-review-task',
            type: 'aide_clinical_review',
            args: { reviewer_roles: 'clinician' },
          },
        ],
      };

      rolesService.getAllRoles.mockResolvedValue([
        {
          id: 'roleid',
          name: 'admin',
          editable: false,
        },
      ]);

      await expect(
        service.createWorkflow(workflow),
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it('destination does not exist throws error', async () => {
      const workflow = {
        informatics_gateway: {
          ae_title: 'monai',
          export_destinations: ['TESTDEST', 'TESTDEST2'],
        },
      };

      const destinations = [
        {
          port: 100,
          name: 'TESTDEST',
          aeTitle: 'TESTDEST',
          hostIp: '3.2.1.5',
        },
      ] as Destination[];

      axios.post.mockResolvedValueOnce({
        status: 201,
      });

      axios.get.mockResolvedValueOnce({
        status: 200,
        data: destinations,
      });

      httpService.post.mockReturnValue(makeObservableForTest(axios.post));
      httpService.get.mockReturnValue(makeObservableForTest(axios.get));

      await expect(
        service.createWorkflow(workflow),
      ).rejects.toThrowErrorMatchingSnapshot();
    });
  });

  describe('editWorkflow', () => {
    it('returns expected result', async () => {
      const workflow = {
        informatics_gateway: {
          ae_title: 'monai',
          export_destinations: ['TESTDEST', 'TESTDEST2'],
        },
      };

      const destinations = [
        {
          port: 100,
          name: 'TESTDEST',
          aeTitle: 'TESTDEST',
          hostIp: '3.2.1.5',
        },
        {
          port: 101,
          name: 'TESTDEST2',
          aeTitle: 'TESTDEST2',
          hostIp: '3.2.1.58',
        },
      ] as Destination[];

      axios.post.mockResolvedValueOnce({
        status: 201,
      });

      axios.get.mockResolvedValueOnce({
        status: 200,
        data: destinations,
      });

      axios.put.mockResolvedValue({
        status: 200,
        data: workflow,
      });

      httpService.post.mockReturnValue(makeObservableForTest(axios.post));
      httpService.get.mockReturnValue(makeObservableForTest(axios.get));
      httpService.put.mockReturnValue(makeObservableForTest(axios.put));

      const result = await service.editWorkflow(
        '45425-435345-435345-5345',
        workflow,
        'workflow',
      );

      expect(result).toMatchSnapshot();
    });

    it('valid reviewer roles returns expected result', async () => {
      const workflow = {
        informatics_gateway: {
          ae_title: 'monai',
          export_destinations: ['TESTDEST', 'TESTDEST2'],
        },
        tasks: [
          {
            id: 'clinical-review-task',
            type: 'aide_clinical_review',
            args: { reviewer_roles: 'clinician' },
          },
        ],
      };

      const destinations = [
        {
          port: 100,
          name: 'TESTDEST',
          aeTitle: 'TESTDEST',
          hostIp: '3.2.1.5',
        },
        {
          port: 101,
          name: 'TESTDEST2',
          aeTitle: 'TESTDEST2',
          hostIp: '3.2.1.58',
        },
      ] as Destination[];

      axios.post.mockResolvedValueOnce({
        status: 201,
      });

      axios.get.mockResolvedValueOnce({
        status: 200,
        data: destinations,
      });

      axios.put.mockResolvedValue({
        status: 200,
        data: workflow,
      });

      rolesService.getAllRoles.mockResolvedValue([
        {
          id: 'roleid',
          name: 'admin',
          editable: false,
        },
        {
          id: 'roleid2',
          name: 'clinician',
          editable: false,
        },
      ]);

      httpService.post.mockReturnValue(makeObservableForTest(axios.post));
      httpService.get.mockReturnValue(makeObservableForTest(axios.get));
      httpService.put.mockReturnValue(makeObservableForTest(axios.put));

      const result = await service.editWorkflow(
        '45425-435345-435345-5345',
        workflow,
        'workflow',
      );

      expect(result).toMatchSnapshot();
    });

    it('missing aeTitle throws error', async () => {
      const workflow = {
        informatics_gateway: {
          export_destinations: ['TESTDEST', 'TESTDEST2'],
        },
      };

      await expect(
        service.editWorkflow('45425-435345-435345-5345', workflow, 'workflow'),
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it('clinical review reviewer_roles missing in keycloak throws error', async () => {
      const workflow = {
        informatics_gateway: {
          export_destinations: ['TESTDEST', 'TESTDEST2'],
        },
        tasks: [
          {
            id: 'clinical-review-task',
            type: 'aide_clinical_review',
            args: { reviewer_roles: 'clinician' },
          },
        ],
      };

      rolesService.getAllRoles.mockResolvedValue([
        {
          id: 'roleid',
          name: 'admin',
          editable: false,
        },
      ]);

      await expect(
        service.editWorkflow('45425-435345-435345-5345', workflow, 'workflow'),
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it('destination does not exist throws error', async () => {
      const workflow = {
        informatics_gateway: {
          ae_title: 'monai',
          export_destinations: ['TESTDEST', 'TESTDEST2'],
        },
      };

      const destinations = [
        {
          port: 100,
          name: 'TESTDEST',
          aeTitle: 'TESTDEST',
          hostIp: '3.2.1.5',
        },
      ] as Destination[];

      axios.post.mockResolvedValueOnce({
        status: 201,
      });

      axios.get.mockResolvedValueOnce({
        status: 200,
        data: destinations,
      });

      httpService.post.mockReturnValue(makeObservableForTest(axios.post));
      httpService.get.mockReturnValue(makeObservableForTest(axios.get));

      await expect(
        service.editWorkflow('45425-435345-435345-5345', workflow, 'workflow'),
      ).rejects.toThrowErrorMatchingSnapshot();
    });
  });
});
