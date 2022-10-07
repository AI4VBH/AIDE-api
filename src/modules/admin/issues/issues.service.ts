import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import { IMonaiPayload } from '../payloads/payload.interface';
import { MonaiWorkflowInstance } from '../workflowinstances/workflowinstances.interface';
import { IssueDto } from './issues.dto';

@Injectable()
export class IssuesService {
  @Inject(HttpService)
  private readonly httpService: HttpService;

  async getIssues(
    workflowInstances: MonaiWorkflowInstance[],
  ): Promise<IssueDto[]> {
    const payloadIds = [
      ...new Set(workflowInstances.map((wf) => wf.payload_id)),
    ];

    const promises: Promise<AxiosResponse<IMonaiPayload>>[] = [];

    for (const payloadId of payloadIds) {
      promises.push(
        lastValueFrom(
          this.httpService.get<IMonaiPayload>(`payloads/${payloadId}`),
        ),
      );
    }

    const payloads = (await Promise.all(promises)).map((resp) => resp.data);

    return this.mapIssues(payloads, workflowInstances);
  }

  private mapIssues(
    payloads: IMonaiPayload[],
    workflowInstances: MonaiWorkflowInstance[],
  ): IssueDto[] {
    const issues: IssueDto[] = [];

    for (const workflowInstance of workflowInstances) {
      const relativePayload = payloads.find(
        (p) => p.payload_id == workflowInstance.payload_id,
      );

      const wfiIssues = workflowInstance.tasks.map((task) =>
        IssueDto.from(task, relativePayload, workflowInstance),
      );

      issues.push(...wfiIssues);
    }

    return issues;
  }
}
