import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateEditWorkflowDto } from './dto/aide-workflow.dto';
import { WorkflowsController } from './workflows.controller';
import { WorkflowsService } from './workflows.service';

describe('WorkflowsController', () => {
  let controller: WorkflowsController;
  let workflowsService: DeepMocked<WorkflowsService>;

  beforeEach(async () => {
    workflowsService = createMock<WorkflowsService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkflowsController],
      providers: [
        {
          provide: WorkflowsService,
          useValue: workflowsService,
        },
      ],
    }).compile();

    controller = module.get<WorkflowsController>(WorkflowsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getWorkflows', () => {
    it('passes the default pageNumber and pageSize to service', async () => {
      await controller.getWorkflows();

      expect(workflowsService.getPagedWorkflows).toHaveBeenCalledWith(1, 10);
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
          await controller.getWorkflows(pageNumber, pageSize);

        await expect(action).rejects.toThrow(BadRequestException);
      },
    );

    it('passes the pageNumber and pageSize to service', async () => {
      await controller.getWorkflows(2, 10);

      expect(workflowsService.getPagedWorkflows).toHaveBeenCalledWith(2, 10);
    });
  });

  describe('getWorkflowById', () => {
    it('passes the workflowId to service', async () => {
      await controller.getWorkflowById('ee64b5a0-b384-4b27-b76a-a3651fa253bd');

      expect(workflowsService.getWorkflowDetail).toHaveBeenCalledWith(
        'ee64b5a0-b384-4b27-b76a-a3651fa253bd',
      );
    });
  });

  describe('createWorkflow', () => {
    it('passes the workflow to service', async () => {
      const body: CreateEditWorkflowDto = {
        workflow: {
          name: 'some-name',
          version: 'v1.0.0',
          description: 'some description',
          informatics_gateway: {
            ae_title: 'title',
            export_destinations: [],
          },
          tasks: [],
        },
      };

      await controller.createWorkflow(body);

      expect(workflowsService.createWorkflow).toHaveBeenCalledWith(
        body.workflow,
      );
    });
  });

  describe('editWorkflow', () => {
    it('passes the correct workflowId and workflow to service', async () => {
      const body: CreateEditWorkflowDto = {
        workflow: {
          name: 'some-name',
          version: 'v1.0.0',
          description: 'some description',
          informatics_gateway: {
            ae_title: 'title',
            export_destinations: [],
          },
          tasks: [],
        },
      };

      await controller.editWorkflow(
        'ead947e7-e06d-408b-8227-4815224fc169',
        body,
      );

      expect(workflowsService.editWorkflow).toHaveBeenCalledWith(
        'ead947e7-e06d-408b-8227-4815224fc169',
        body.workflow,
      );
    });
  });

  describe('deleteWorkflow', () => {
    it('passes the workflowId to service', async () => {
      await controller.deleteWorkflowById(
        'a7048ec7-eb03-4d6b-8576-23b5af9b9b37',
      );

      expect(workflowsService.deleteWorkflow).toHaveBeenCalledWith(
        'a7048ec7-eb03-4d6b-8576-23b5af9b9b37',
      );
    });
  });
});
