<!--
  ~ Copyright 2022 Crown Copyright
  ~
  ~ Licensed under the Apache License, Version 2.0 (the "License");
  ~ you may not use this file except in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~ http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing, software
  ~ distributed under the License is distributed on an "AS IS" BASIS,
  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  ~ See the License for the specific language governing permissions and
  ~ limitations under the License.
-->

# Payloads

The `payloads` endpoints provide the following APIs to retrieve data related to payloads.

## `GET /payloads?pageNumber=:pageNumber&pageSize=:pageSize`

Returns a PagedResponse list of payloads.

### Parameters

| Parameter Type | Label | Description | Format | Example |
|----------------|-------|-------------|--------|---------|
| Query | `:pageNumber` | `number` Page number for request. | 0-9 | 99
| Query | `:pageSize` | `number` Page size for request. | 0-9 | 99

### Responses

| Code | Description |
|------|-------------|
| `200` | PagedResponse of Payloads retrieved successfully. |
| `500` | Server error. The response will be a [Problem details](https://datatracker.ietf.org/doc/html/rfc7807) object with server error details. |

### Example Request

```bash
curl --location --request GET 'http://localhost:5000/payloads?pageNumber=1&pageSize=2'
```

### Example Response

```json
{
  "pageNumber": 1,
  "pageSize": 1,
  "firstPage": "/payload?pageNumber=1&pageSize=1",
  "lastPage": "/payload?pageNumber=1&pageSize=1",
  "totalPages": 100,
  "totalRecords": 100,
  "nextPage": 2,
  "previousPage": null,
  "data": [
            {
                "payload_id": "86c0f117-4021-412e-b163-0dc621df672a",
                "patient_id": "1d0253c4-8fab-41df-a414-55d52e4c6c3f",
                "patient_name": "Lillie Doe",
                "payload_received": "2022-08-17T12:21:10.203Z",
            }
          ],
}
```

---

## `GET /payloads/:payloadId/executions`

Returns a list of WorkflowInstances executed from payload.

### Parameters

| Parameter Type | Label | Description | Format | Example |
|----------------|-------|-------------|--------|---------|
| URL | `:payloadId` | `guid` of the payload. | GUID | 86c0f117-4021-412e-b163-0dc621df672a

### Responses

| Code | Description |
|------|-------------|
| `200` | Executions retrieved successfully. |
| `500` | Server error. The response will be a [Problem details](https://datatracker.ietf.org/doc/html/rfc7807) object with server error details. |

### Example Request

```bash
curl --location --request GET 'http://localhost:5000/payloads/86c0f117-4021-412e-b163-0dc621df672a/executions'
```

### Example Response

```json
[
    {
        "id": "c5e980ff-e278-441b-af64-8630bf57b7e3",
        "ae_title": "some-title",
        "payload_id": "041293d0-ab97-4ea1-b967-42ec62f26608",
        "workflow_id": "fca60a4d-2932-4196-9206-cf123c82332b",
        "start_time": "2022-09-22T12:45:13.102Z",
        "status": "Succeeded",
        "tasks": [
        {
            "task_id": "some-special-task",
            "workflow_instance_id": "e02e3bbc-a760-4d83-8cfe-ce3a77424171",
            "execution_id": "981eca65-294a-434a-930a-b1828b54253a",
            "previous_task_id": "",
            "status": "Suceeded",
            "task_start_time": "2022-09-23T12:50:00.305Z",
        },
        {
            "task_id": "export-task",
            "workflow_instance_id": "e02e3bbc-a760-4d83-8cfe-ce3a77424171",
            "execution_id": "981eca65-294a-434a-930a-b1828b54253a",
            "previous_task_id": "some-special-task",
            "status": "Suceeded",
            "task_start_time": "2022-09-23T12:50:00.305Z",
        },
        {
            "task_id": "email-task",
            "workflow_instance_id": "e02e3bbc-a760-4d83-8cfe-ce3a77424171",
            "execution_id": "981eca65-294a-434a-930a-b1828b54253a",
            "previous_task_id": "export-task",
            "status": "Suceeded",
            "task_start_time": "2022-09-23T12:50:00.305Z",
        },
        ],
    },
]
```