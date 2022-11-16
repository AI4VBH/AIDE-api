# Workflows

Manage workflows in the Workflow Manager.

## `GET /workflows?pageNumber=:pageNumber&pageSize=:pageSize`

Returns a paginated list of workflows.

### Parameters

| Parameter Type | Label | Description |
|----------------|-------|-------------|
| Query | `:pageNumber` | `number` current page number. default `0` |
| Query | `:pageSize` | `number` the number of items per page. default `10` |

### Responses

| Code | Description |
|------|-------------|
| `200` | Returns the paginated list of workflows. `PagedMonaiWorkflows` |
| `400` | Invalid range for `pageNumber` or `pageSize` |
| `500` | Server error. The response will be a [Problem details](https://datatracker.ietf.org/doc/html/rfc7807) object with server error details. |

### Example Request

```bash
curl --location --request GET 'http://localhost:5000/workflows?pageNumber=1&pageSize=5'
```

### Example Response

```json
{
  "totalPages": 1,
  "totalRecords": 1,
  "data": [
    {
      "id": "1564c53c-53b7-4971-8bb2-a3d3bc051f1c",
      "workflow_id": "5507c486-5a28-4f93-a0a3-0014c308318f",
      "revision": 1,
      "name": "workflow-name",
      "description": "workflow description",
      "version": "v1.0"
    }
  ]
}
```

---

## `GET /workflows/:workflowId`

Returns the workflow information from MONAI.

### Parameters

| Parameter Type | Label | Description |
|----------------|-------|-------------|
| URL | `:workflowId` | the id of the workflow |

### Responses

| Code | Description |
|------|-------------|
| `200` | The workflow object from MONAI. |
| `404` | Workflow with the given ID not found. |
| `500` | Server error. The response will be a [Problem details](https://datatracker.ietf.org/doc/html/rfc7807) object with server error details. |

### Example Request

```bash
curl --location --request GET 'http://localhost:5000/workflows/6542f955-8ddb-4e91-9ca3-948b1e32ffd9'
```

### Example Response

```json
{
  "id": "f58fe206-1976-45bc-9d14-b9459eee2dfe",
  "revision": 3,
  "workflow": {
    "description": "This workflow is to be used for connectathon",
    "informatics_gateway": {
      "ae_title": "MonaiSCU",
      "data_origins": [
        "test",
      ],
      "export_destinations": [
        "ORTHANC",
      ],
    },
    "name": "Export Workflow",
    "tasks": [
      {
        "args": {
          "test": "test1",
        },
        "artifacts": {
          "input": [
            {
              "mandatory": true,
              "name": "study",
              "value": "{{ context.input.dicom }}",
            },
          ],
          "output": [],
        },
        "description": "Connectathon export task",
        "export_destinations": [
          {
            "name": "ORTHANC",
          },
        ],
        "id": "export-task-connectathon",
        "input_parameters": null,
        "ref": "",
        "task_destinations": [],
        "type": "export",
      },
    ],
    "version": "2.0.0",
  },
  "workflow_id": "0ea7b5b9-64ba-4841-b252-d6e312ef7e8e",
}
```

---

## `POST /workflows`

Create a new workflow in the Workflow Manager.

### Parameters

| Parameter Type | Label | Description |
|----------------|-------|-------------|
| Body | | `CreateEditWorkflowDto`. workflow that needs creating |

### Responses

| Code | Description |
|------|-------------|
| `201` | Workflow created. |
| `400` | Invalid workflow object. |
| `500` | Server error. The response will be a [Problem details](https://datatracker.ietf.org/doc/html/rfc7807) object with server error details. |

### Example Request

```bash
# rest of workflow body removed for brevity

curl --location --request POST 'http://localhost:5000/workflows' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "workflow": {
      "informatics_gateway": {
        "ae_title": "TITLE",
        "export_destinations": []
      }
    }
  }'
```

### Example Response



---

## `PUT /workflows/:workflowId`

Create a new workflow in the Workflow Manager.

### Parameters

| Parameter Type | Label | Description |
|----------------|-------|-------------|
| URL | `:workflowId` | Id of workflow to edit |
| Body | | `CreateEditWorkflowDto`. workflow object |

### Responses

| Code | Description |
|------|-------------|
| `201` | Workflow updated. |
| `400` | Invalid workflow object. |
| `404` | Workflow with the given ID not found |
| `500` | Server error. The response will be a [Problem details](https://datatracker.ietf.org/doc/html/rfc7807) object with server error details. |

### Example Request

```bash
# rest of workflow body removed for brevity

curl --location --request PUT 'http://localhost:5000/workflows/workflow-id' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "workflow": {
      "informatics_gateway": {
        "ae_title": "TITLE",
        "export_destinations": []
      }
    }
  }'
```

---

## `DELETE /workflows/:workflowId`

Delete the workflow with a given ID.

### Parameters

| Parameter Type | Label | Description |
|----------------|-------|-------------|
| URL | `:workflowId` | Id of workflow to delete |

### Responses

| Code | Description |
|------|-------------|
| `200` | Workflow deleted. |
| `404` | Workflow with the given ID not found |
| `500` | Server error. The response will be a [Problem details](https://datatracker.ietf.org/doc/html/rfc7807) object with server error details. |

### Example Request

```bash
curl --location --request DELETE 'http://localhost:5000/workflows/workflow-id'
```

### Example Response

N/A