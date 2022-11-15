# Users

Interfaces with Keycloak to manage users.

## `GET /users?first=:first&max=:max&search=:search&sortBy=:sortBy&sortDesc=:sortDesc`

Returns a paginated, filtered and sorted list of users.

### Parameters

| Parameter Type | Label | Description |
|----------------|-------|-------------|
| Query | `:first` | `number` offset number of users |
| Query | `:max` | `number`. maximum number of users in a list |
| Query | `:search` | `string`. search string filter for the user name or email. |
| Query | `:sortBy` | `string`. property name to sort by. |
| Query | `:sortDesc` | `boolean`. to sort descending by the property name given |

### Responses

Returns a paginated list of users from Keycloak.

| Code | Description |
|------|-------------|
| `200` | Paginated list of users. See `UserPage`. |
| `500` | Internal server error. |

### Example Request

```bash
curl --location --request GET 'http://localhost:5000/users?first=0&max=10'
```

### Example Response

```json
{
  "totalUserCount": 1,
  "totalFilteredUserCount": 1,
  "users": [
    {
      "id": "c5852112-ab18-447e-b059-06f984d5489b",
      "firstName": "John",
      "lastName": "Smith",
      "email": "john.smith@email.com",
      "realmRoles": [
        {
          "id": "85049658-0708-492f-87da-793922fad734",
          "name": "Admin"
        }
      ],
      "enabled": true
    }
  ]
}
```

---

## `GET /users/:user-id`

Returns the details of a specific user.

### Parameters

| Parameter Type | Label | Description |
|----------------|-------|-------------|
| URL | `:user-id` | `UUID` of the user |

### Response

| Code | Description |
|------|-------------|
| `200` | Returns a user for a given id |
| `404` | No user found for a given id |
| `500` | Server error. |

### Example Request

```bash
curl --location --request GET 'http://locahost:5000/users/c5852112-ab18-447e-b059-06f984d5489b'
```

### Example Response

```json
{
  "id": "c5852112-ab18-447e-b059-06f984d5489b",
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@email.com",
  "realmRoles": [
    {
      "id": "85049658-0708-492f-87da-793922fad734",
      "name": "Admin"
    }
  ],
  "enabled": true
}
```

---

## `POST /users`

Create a user.

### Parameters

| Parameter Type | Label | Description |
|----------------|-------|-------------|
| Body | | `CreateUserDto` to be added to Keycloak |

### Responses

| Code | Description |
|------|-------------|
| `200` | User created |
| `400` | Invalid user |
| `409` | User with email already exists |
| `500` | Server error |

### Example Request

```bash
curl --location --request POST 'http://locahost:5000/users' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "firstName": "Joe",
    "lastName": "Bloggs",
    "email": "joe.bloggs@email.com",
    "realmRoles": [],
    "enabled": true
  }'
```

### Example Response

```json
{
  "id": "015ea940-2f39-4d86-bce7-4158ee4d965c",
  "firstName": "Joe",
    "lastName": "Bloggs",
    "email": "joe.bloggs@email.com",
    "realmRoles": [],
    "enabled": true
}
```

---

## `PUT /users/:user-id`

Edit a user for a given ID.

### Parameters

| Parameter Type | Label | Description |
|----------------|-------|-------------|
| Body | | `EditUserDto` to be updated |

### Responses

| Code | Description |
|------|-------------|
| `200` | User created |
| `400` | Invalid user |
| `404` | User with the given ID not found |
| `409` | User with email already exists |
| `500` | Server error |

### Example Request

```bash
curl --location --request PUT 'http://locahost:5000/users015ea940-2f39-4d86-bce7-4158ee4d965c' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "firstName": "Joe",
    "lastName": "Bloggs",
    "email": "joe.bloggs@email.com",
    "realmRoles": [],
    "enabled": false
  }'
```

### Example Response

```json
{
  "id": "015ea940-2f39-4d86-bce7-4158ee4d965c",
  "firstName": "Joe",
    "lastName": "Bloggs",
    "email": "joe.bloggs@email.com",
    "realmRoles": [],
    "enabled": false
}
```

---

## `DELETE /users/:user-id`

Delete a user with the given ID.

### Parameters

| Parameter Type | Label | Description |
|----------------|-------|-------------|
| URL | `:user-id` | `UUID` of the user |

### Responses

| Code | Description |
|------|-------------|
| `200` | User with a given id deleted |
| `404` | No user found for a given id |
| `500` | Server error. |

### Example Request

```bash
curl --location --request DELETE 'http://localhost:5000/users/69adce8b-b7ee-4e8c-aeb1-8420820520c3'
```

### Example Response

N/A