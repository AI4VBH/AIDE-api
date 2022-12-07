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

import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import {
  Destination,
  MonaiWorkflow,
  PagedMonaiWorkflows,
} from './monai-workflow.interfaces';
import { mapToPagedWorkflowsDto } from './workflows.mapper';
import { WorkflowDto } from './dto/aide-workflow.dto';
import {
  WorkflowServiceException,
  WorkflowValidationException,
} from './workflow.service.exceptions';
import { RolesService } from 'modules/roles/roles.service';

@Injectable()
export class WorkflowsService {
  @Inject(HttpService)
  private readonly httpService: HttpService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Inject(RolesService)
  private readonly rolesService: RolesService;

  async getPagedWorkflows(pageNumber: number, pageSize: number) {
    const params = new URLSearchParams({
      pageSize: `${pageSize || ''}`,
      pageNumber: `${pageNumber || ''}`,
    });

    const paged = await firstValueFrom(
      this.httpService.get<PagedMonaiWorkflows>(`/workflows?${params}`),
    );

    return mapToPagedWorkflowsDto(paged.data);
  }

  async getWorkflowDetail(workflowId: string) {
    const detail = await firstValueFrom(
      this.httpService.get<MonaiWorkflow>(`/workflows/${workflowId}`),
    );

    return detail.data;
  }

  async registerAeTitleAndVerifyDestinations(
    aeTitle: string,
    destinations: string[],
  ) {
    if (!aeTitle || !aeTitle.trim()) {
      throw new WorkflowServiceException(
        'AE Title not found, config is invalid',
      );
    }

    const baseURL = this.configService.get<string>('MIG_API_HOST');
    const aeTitleRequest = { name: aeTitle, aeTitle: aeTitle };

    await firstValueFrom(
      this.httpService.post('/config/ae', aeTitleRequest, {
        baseURL,
        validateStatus: (status: number) => status === 201 || status === 409,
      }),
    );

    if (destinations && destinations.length > 0) {
      const getDestination = await firstValueFrom(
        this.httpService.get<Destination[]>('/config/destination', {
          baseURL,
        }),
      );

      const existingDestinations = getDestination.data.map((item) => item.name);

      if (!destinations.every((v) => existingDestinations.includes(v))) {
        throw new WorkflowServiceException(
          'Not all export destinations are registered',
        );
      }
    }
  }

  async verifyClinicalReviewRoles(
    workflow: Partial<WorkflowDto>,
  ): Promise<{ success: boolean; errorMessage: string }> {
    const clinicalReviewTasks = workflow?.tasks?.filter(
      (t) => t.type.toLowerCase() == 'aide_clinical_review',
    );

    if (!clinicalReviewTasks) {
      return { success: true, errorMessage: '' };
    }

    let message = 'The following tasks have invalid reviewer roles:';
    let success = true;

    for (const reviewTask of clinicalReviewTasks) {
      const commaSeparatedRoles = reviewTask?.args['reviewer_roles'];
      const roles: string[] = commaSeparatedRoles?.split(',') ?? [];

      if (!roles) {
        continue;
      }

      if (!(await this.verifyRoles(roles))) {
        success = false;
        message += ` ${reviewTask.id}`;
      }
    }

    const errorMessage = !success ? message : '';
    return { success, errorMessage };
  }

  async verifyRoles(roles: string[]) {
    if (!roles || roles.length < 1) {
      return true;
    }
    const rolesList = await this.rolesService.getAllRoles();

    const roleNameList = rolesList?.map((r) => r.name.toLowerCase());

    if (roles?.every((r) => roleNameList?.includes(r.trim().toLowerCase()))) {
      return true;
    }

    return false;
  }

  async createWorkflow(workflow: Partial<WorkflowDto>) {
    const aeTitle = workflow?.informatics_gateway?.ae_title as string;
    const destinations = workflow?.informatics_gateway
      ?.export_destinations as string[];

    await this.verifyClinicalReviewRoles(workflow);

    await this.registerAeTitleAndVerifyDestinations(aeTitle, destinations);

    const result = await firstValueFrom(
      this.httpService.post('/workflows', workflow),
    );

    return result.data;
  }

  async editWorkflow(
    workflowId: string,
    workflow: Partial<WorkflowDto>,
    original_workflow_name: string,
  ) {
    const aeTitle = workflow?.informatics_gateway?.ae_title as string;
    const destinations = workflow?.informatics_gateway
      ?.export_destinations as string[];

    await this.registerAeTitleAndVerifyDestinations(aeTitle, destinations);

    const result = await firstValueFrom(
      this.httpService.put(`/workflows/${workflowId}`, {
        original_workflow_name,
        workflow,
      }),
    );

    return result.data;
  }

  async deleteWorkflow(workflowId: string) {
    const result = await firstValueFrom(
      this.httpService.delete(`/workflows/${workflowId}`),
    );

    return result.data;
  }

  async validateWorkflow(
    workflow: Partial<WorkflowDto>,
    original_workflow_name: string,
  ): Promise<void> {
    const promises = [
      this.verifyClinicalReviewRoles(workflow),
      this.validate(workflow, original_workflow_name),
    ];

    const allResult = await Promise.all(promises);

    const result = {
      success: allResult.every((r) => r.success === true),
      errorMessage: allResult.map((r) => r.errorMessage ?? '').join(', '),
    };

    if (result.success === false) {
      throw new WorkflowValidationException(result.errorMessage);
    }
  }

  async validate(
    workflow: Partial<WorkflowDto>,
    original_workflow_name: string,
  ): Promise<{ success: boolean; errorMessage: string }> {
    const result = await firstValueFrom(
      this.httpService.post(`/workflows/validate`, {
        original_workflow_name,
        workflow,
      }),
    );

    return {
      success: result.status == 204,
      errorMessage: result?.data?.detail ?? '',
    };
  }
}
