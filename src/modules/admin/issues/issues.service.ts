import { Injectable } from '@nestjs/common';
import { IssueDTO } from './issues.dto';

@Injectable()
export class IssuesService {
  getIssues(): IssueDTO[] {
    return [
      {
        task_id: 2,
        status: 'Error',
        model_name: '3D Fetal Brain MRI',
        patient_name: 'Alex Bazin',
        patient_id: '123 123 1234',
        execution_time: '20220516T151114',
      },
      {
        task_id: 4,
        status: 'Error',
        model_name: 'Stroke Pathway',
        patient_name: 'Richard McRichardson',
        patient_id: '623 723 8234',
        execution_time: '20220516T151114',
      },
    ];
  }

  dismissTask(): IssueDTO {
    return {} as IssueDTO;
  }
}