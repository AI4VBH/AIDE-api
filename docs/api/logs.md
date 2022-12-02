<!--
  ~ Copyright 2022 Guy’s and St Thomas’ NHS Foundation Trust
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

# Logs

Returns logs from Elastic.

## `GET /logs/:id`

Returns logs for a given execution ID.

### Parameters

| Parameter Type | Label | Description |
|----------------|-------|-------------|
| URL | `:id` | `UUID` Task execution id. |

### Responses

Returns an array of `LogsDto`.

| Code | Description |
|------|-------------|
| `200` | Logs for a given task execution id retrieved. |
| `400` | Missing task execution id |
| `500` | Server error. The response will be a [Problem details](https://datatracker.ietf.org/doc/html/rfc7807) object with server error details. |

### Example Request

```bash
curl --location --request GET 'http://localhost:5000/logs/18119a95-b097-498d-a815-62c140e201e7'
```

### Example Responses

```json
[
  {
    "level": "Information",
    "renderedMessage": "Task dispatch event saved \"04a0cded-6aad-408c-b45d-1852ad54fae3\".",
    "timestamp": "2022-09-26T15:19:23.6849023Z",
  },
  {
    "level": "Information",
    "renderedMessage": "Publishing message to \"rabbitmq.monai\"/\"monaideploy\". Exchange=\"monaideploy\", Routing Key=\"md.tasks.dispatch\".",
    "timestamp": "2022-09-26T15:19:22.9668840Z",
  }
]
```