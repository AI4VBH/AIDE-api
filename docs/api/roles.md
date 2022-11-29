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

# Roles

Interfaces with Keycloak to manage roles.

## `GET /roles/list`

### Parameters

N/A

### Responses

| Code | Description |
|------|-------------|
| `200` | Returns a list of roles. |
| `500` | Server error. The response will be a [Problem details](https://datatracker.ietf.org/doc/html/rfc7807) object with server error details. |

### Example Request

```bash
curl --location --request GET 'http://localhost:5000/roles/list'
```

### Example Response

```json
[
  {
    "id": "ecacda90-c64c-4be5-b36d-7a8630419fa3",
    "name": "admin",
    "editable": false
  },
  {
    "id": "69adce8b-b7ee-4e8c-aeb1-8420820520c3",
    "name": "other-role",
    "editable": true
  }
]
```

---

## `GET /roles?first=:first&max=:max&search=:search&sortBy=:sortBy&sortDesc=:sortDesc`

Returns a paginated, filtered and sorted list of roles.

### Parameters

| Parameter Type | Label | Description |
|----------------|-------|-------------|
| Query | `:first` | `number` offset number of roles |
| Query | `:max` | `number`. maximum number of roles in a list |
| Query | `:search` | `string`. search string filter for the role name. |
| Query | `:sortBy` | `string`. property name to sort by. |
| Query | `:sortDesc` | `boolean`. to sort descending by the property name given |

### Responses

Returns a paginated list of roles from Keycloak.

| Code | Description |
|------|-------------|
| `200` | Paginated list of roles. See `PaginatedRolesResponse`. |
| `500` | Internal server error. |

### Example Request

```bash
curl --location --request GET 'http://localhost:5000/roles?first=0&max=10'
```

### Example Response

```json
{
  "totalRolesCount": 2,
  "totalFilteredRolesCount": 2,
  "roles": [
    {
      "id": "ecacda90-c64c-4be5-b36d-7a8630419fa3",
      "name": "admin",
      "editable": false
    },
    {
      "id": "69adce8b-b7ee-4e8c-aeb1-8420820520c3",
      "name": "other-role",
      "editable": true
    }
  ]
}
```

---

## `GET /roles/:role-id`

Returns the details of a specific role.

### Parameters

| Parameter Type | Label | Description |
|----------------|-------|-------------|
| URL | `:role-id` | `UUID` of the role |

### Responses

| Code | Description |
|------|-------------|
| `200` | Returns a role for a given id |
| `404` | No role found for a given id |
| `500` | Server error. |

### Example Request

```bash
curl --location --request GET 'http://localhost:5000/roles/69adce8b-b7ee-4e8c-aeb1-8420820520c3'
```

### Example Response

```json
{
  "id": "69adce8b-b7ee-4e8c-aeb1-8420820520c3",
  "name": "other-role",
  "editable": true
}
```

---

## `DELETE /roles/:role-id`

Delete a role with a given id.

### Parameters

| Parameter Type | Label | Description |
|----------------|-------|-------------|
| URL | `:role-id` | `UUID` of the role |

### Responses

| Code | Description |
|------|-------------|
| `200` | Role with a given id deleted |
| `404` | No role found for a given id |
| `500` | Server error. |

### Example Request

```bash
curl --location --request DELETE 'http://localhost:5000/roles/69adce8b-b7ee-4e8c-aeb1-8420820520c3'
```

### Example Response

N/A

---

## `POST /roles`

Create a new role.

### Parameters

| Parameter Type | Label | Description |
|----------------|-------|-------------|
| Body | | `NewRoleDto` to be added to Keycloak |

### Responses

| Code | Description |
|------|-------------|
| `200` | Role created |
| `400` | Invalid role |
| `409` | Role with name already exists |
| `500` | Server error |

### Example Request

```bash
curl --location --request 'http://localhost:5000/roles' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "name": "new-role",
    "description:": "description"
  }'
```

### Example Response

```json
{
  "roleName": "new-role"
}
```

---

## `PUT /roles/:role-id`

Update a role with a given id.

### Parameters

| Parameter Type | Label | Description |
|----------------|-------|-------------|
| URL | `:role-id` | `UUID` of the role being edited |
| Body | | `NewRoleDto` |

### Responses

| Code | Description |
|------|-------------|
| `200` | Role updated |
| `400` | Invalid role details/role not editable |
| `404` | Role with given id not found |
| `500` | Server error |

### Example Request

```bash
curl --location --request 'http://localhost:5000/roles/69adce8b-b7ee-4e8c-aeb1-8420820520c3' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "name": "update-role-name",
    "description:": "description"
  }'
```

### Example Response

N/A