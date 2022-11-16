# Workflow Instances

## `PUT /workflwoinstances/:workflow_instance_id/executions/:execution_id/acknowledge`

Acknowledge task errors for a given execution of a workflow.

### Parameters

| Parameter Type | Label | Description |
|----------------|-------|-------------|
| URL | `:workflow_instance_id` | The workflow instance ID |
| URL | `:execution_id` | The task execution ID |

### Response

| Code | Description |
|------|-------------|
| `200` | Returns acknowledged `MonaiWorkflowInstance` |
| `404` | Workflow instance not found or task execution not found. |
| `500` | Server error. The response will be a [Problem details](https://datatracker.ietf.org/doc/html/rfc7807) object with server error details. |

### Example Request

```bash
curl --location --request PUT 'http://localhost:5000/workflwoinstances/3ef05fc1-dd5e-402a-b382-a557de1e383c/executions/04533a0b-d43d-47d4-8aac-1efaca39b778/acknowledge'
```

### Example Response

```json
{
  "acknowledged_workflow_errors": "",
  "ae_title": "MONAI",
  "bucket_id": "monaideploy",
  "id": "a67a7af7-068b-44b8-a81b-def7b3e5403b",
  "input_metadata": {},
  "payload_id": "d801bd68-381d-4ff3-95a8-85c46380e075",
  "start_time": "2022-09-22T12:45:13.102Z",
  "status": "Failed",
  "tasks": [
    {
      "acknowledged_task_errors": "2022-10-03T12:00:00.001Z",
      "execution_id": "3b9d94b9-4285-45d4-bea9-491fa62b8f91",
      "execution_stats": {},
      "input_artifacts": {
        "input-dicom": "d801bd68-381d-4ff3-95a8-85c46380e075/dcm",
      },
      "input_parameters": {},
      "next_timeout": "2022-09-22T12:45:13.102Z",
      "output_artifacts": {},
      "output_directory": "d801bd68-381d-4ff3-95a8-85c46380e075/workflows/a67a7af7-068b-44b8-a81b-def7b3e5403b/3b9d94b9-4285-45d4-bea9-491fa62b8f91",
      "previous_task_id": "",
      "reason": "Connection time-out",
      "result": {},
      "status": "failed",
      "task_id": "mean-pixel-calc",
      "task_plugin_arguments": {},
      "task_start_time": "2022-09-22T12:45:13.102Z",
      "task_type": "argo",
      "timeout_interval": 0,
      "workflow_instance_id": "a67a7af7-068b-44b8-a81b-def7b3e5403b"
    }
  ],
  "workflow_id": "0c262733-05a1-4811-9d9a-b5cadb5a475a"
}
```