# Issues

The `issues` endpoint provides the following APIs to retrieve issues for failed workflows.

## `GET /issues/failed?acknowledged=:acknowledged`

Returns a list of issues.

### Parameters

| Parameter Type | Label | Description | Format | Example |
|----------------|-------|-------------|--------|---------|
| Query | `:acknowledged` | `date` UTC Date ISO 8601 Date and time format. | YYYY-MM-DD | 2021-12-20

### Responses

| Code | Description |
|------|-------------|
| `200` | Issues retrieved successfully. |
| `500` | Server error. The response will be a [Problem details](https://datatracker.ietf.org/doc/html/rfc7807) object with server error details. |

### Example Request

```bash
curl --location --request GET 'http://localhost:5000/issues/failed?acknowledged=2021-12-20'
```

### Example Response

```json
[
    {
        "execution_id": "981eca65-294a-434a-930a-b1828b54253a",
        "execution_time": "2022-09-23T12:50:00.305Z",
        "patient_id": "patient-id",
        "patient_name": "Lillie Dae",
        "status": "Failed",
        "task_id": "email-task",
        "workflow_instance_id": "c5e980ff-e278-441b-af64-8630bf57b7e3",
        "workflow_name": "lillie",
    }
]
```