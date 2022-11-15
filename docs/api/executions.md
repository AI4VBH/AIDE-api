# Executions

## `GET /executions/:workflow_instance_id/tasks/:execution_id/artifacts`

This returns the task output artifacts.

### Parameters

| Parameter Type | Label | Description |
|----------------|-------|-------------|
| URL | `:workflow_instance_id` | The workflow instance ID |
| URL | `:execution_id` | The task execution ID |

### Responses

This endpoint returns a dictionary of filename and MINIO object key.

| Code | Description |
|------|-------------|
| `200` | Returns output artifacts |
| `404` | Workflow instance not found or task execution not found. |
| `500` | Server error. The response will be a [Problem details](https://datatracker.ietf.org/doc/html/rfc7807) object with server error details. |

### Example Request

```bash
curl --location --request GET 'http://localhost:5000/executions/9df2f059-7669-4404-b02c-427510d7db04/tasks/c2fa42a0-4a96-46b0-b599-8467ca6d3f7e/artifacts'
```

### Example Response

```json
{
  "dicom-report": "9df2f059-7669-4404-b02c-427510d7db04/c2fa42a0-4a96-46b0-b599-8467ca6d3f7e/dicom-report"
}
```

---

## `GET /executions/artifact-download?key=:object_key`

This redirects the request to a pre-signed URL from MINIO enabling the downloading of file.

### Parameters

| Parameter Type | Label | Description |
|----------------|-------|-------------|
| Query | `:object_key` | The object key for the artifact you are attempting to download |

### Responses

| Code | Description |
|------|-------------|
| `302` | Redirect to the pre-signed MINIO url |
| `400` | Missing `:object_key` |
| `500` | Internal server error |

### Example Request

```bash
curl --location --request GET 'http://localhost:5000/executions/artifact-download?key=9df2f059-7669-4404-b02c-427510d7db04/c2fa42a0-4a96-46b0-b599-8467ca6d3f7e/dicom-report'
```

---

## `GET /executions/:workflow_instance_id/tasks/:execution_id/metadata`

Returns the task execution metadata.

### Response

Returns a dictionary.

| Code | Description |
|------|-------------|
| `200` | Returns execution metadata |
| `404` | Workflow instance not found or task execution not found. |
| `500` | Server error. The response will be a [Problem details](https://datatracker.ietf.org/doc/html/rfc7807) object with server error details. |

### Example Request

```bash
curl --location --request GET 'http://localhost:5000/executions/9df2f059-7669-4404-b02c-427510d7db04/tasks/c2fa42a0-4a96-46b0-b599-8467ca6d3f7e/metadata'
```

### Example Response

```json
{
  "metadata-1": "value",
  "metadata-2": "value"
}
```

