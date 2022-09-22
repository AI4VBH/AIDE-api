export default class WorkflowMocks {
  public static basicWorkflows1 = require('./basic-workflows-1.json');
  public static basicWorkflows2 = require('./basic-workflows-2.json');
  public static basicWorkflows3 = require('./basic-workflows-3.json');
  public static basicWorkflows4 = require('./basic-workflows-4.json');
  public static singleWorkflow1 = require('./single-workflow-1.json');
  public static singleWorkflow2 = require('./single-workflow-2.json');
  public static singleWorkflow3 = require('./single-workflow-3.json');
  public static nonExistentGetWorkflowError = require('./non-existent-workflow-get-error.json');
  public static nonExistentPutWorkflowError = require('./non-existent-workflow-put-error.json');
  public static invalidWorkflowIdError = require('./invalid-workflowid-error.json');
  public static invalidWorkflowBodyError = require('./invalid-workflow-body-error.json');
  public static emptyWorkflowData = require('./empty-workflow-data.json');
  public static postPutResponse = require('./post-put-response.json');
}
