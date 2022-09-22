import {
  MonaiWorkflow,
  PagedMonaiWorkflows,
} from './monai-workflow.interfaces';
import {
  mapToPagedWorkflowsDto,
  mapToPagedWorkflowsItemDto,
} from './workflows.mapper';

describe('mapToPagedWorkflowsDto', () => {
  it.each([null, undefined])('throws exception when paged is %s', (paged) => {
    const action = () => mapToPagedWorkflowsDto(paged);

    expect(action).toThrowError('paged is null or undefined');
  });

  it('returns expected result', () => {
    const paged: PagedMonaiWorkflows = {
      pageNumber: 1,
      pageSize: 10,
      firstPage: '/page/1',
      lastPage: '/page/2',
      previousPage: null,
      nextPage: null,
      totalPages: 1,
      totalRecords: 0,
      data: [],
    };

    const result = mapToPagedWorkflowsDto(paged);

    expect(result).toMatchSnapshot();
  });
});

describe('mapToPagedWorkflowsItemDto', () => {
  it('returns expected result', () => {
    const workflow: MonaiWorkflow = {
      id: 'fb94b9da-e957-4378-a626-8f0374e60cfb',
      workflow_id: 'c7610e0b-02b7-474d-b6e5-1224debc414d',
      revision: 2,
      workflow: {
        name: 'Super Workflow',
        version: '1.0.0',
        description: 'Some description',
      },
    };

    const result = mapToPagedWorkflowsItemDto(workflow);

    expect(result).toMatchSnapshot();
  });
});
