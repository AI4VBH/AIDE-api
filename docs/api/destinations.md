# Destinations

The `destinations` endpoint provides the following APIs to configure the export destinations for workflow results.

## `GET /destinations`

Returns a list of destinations.

### Parameters

N/A

### Responses

| Code | Description |
|------|-------------|
| `200` | Destinations retrieved successfully. |
| `500` | Server error. The response will be a [Problem details](https://datatracker.ietf.org/doc/html/rfc7807) object with server error details. |

### Example Request

```bash
curl --location --request POST 'http://localhost:5000/destinations'
```

### Example Response

```json
[
  {
    "port": 104,
    "name": "USEAST",
    "aeTitle": "PACSUSEAST",
    "hostIp": "10.20.3.4"
  }
]
```

---

## `POST /destinations`

### Parameters

| Parameter Type | Label | Description |
|----------------|-------|-------------|
| Body | | See the `IDestination` interface for details. |

### Responses

| Code | Description |
|------|-------------|
| `201` | Destination created successfully. |
| `400` | Validation error. |
| `500` | Server error. The response will be a [Problem details](https://datatracker.ietf.org/doc/html/rfc7807) object with server error details. |

### Example Request

```bash
curl --location --request POST 'http://localhost:5000/destinations' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "name": "USEAST",
        "hostIp": "10.20.3.4",
        "port": 104,
        "aeTitle": "PACSUSEAST"
    }'
```

### Example Response

```json
{
  "port": 104,
  "name": "USEAST",
  "aeTitle": "PACSUSEAST",
  "hostIp": "10.20.3.4"
}
```

---

## `PUT /destinations/:name`

### Parameters

| Parameter Type | Label | Description |
|----------------|-------|-------------|
| URL | `:name` | `string` corresponding to the destination name. |
| Body | | See the `IDestination` interface for details. |


### Responses

| Code | Description |
|------|-------------|
| `200` | DICOM destination updated successfully. |
| `400` | Validation error. The response will be a [Problem details](https://datatracker.ietf.org/doc/html/rfc7807) object with details of the validation errors . |
| `404` | DICOM destination cannot be found. |
| `500` | Server error. The response will be a [Problem details](https://datatracker.ietf.org/doc/html/rfc7807) object with server error details. |

### Example Request

```bash
curl --location --request PUT 'http://localhost:5000/destinations/USEAST' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "name": "USEAST",
        "hostIp": "10.20.3.4",
        "port": 104,
        "aeTitle": "PACSUSEAST"
    }'
```

### Example Response

```json
{
  "port": 104,
  "name": "USEAST",
  "aeTitle": "PACSUSEAST",
  "hostIp": "10.20.3.4"
}
```

---

## `GET /destinations/echo/:name`

Checks the status of a destination

### Parameters

| Parameter Type | Label | Description |
|----------------|-------|-------------|
| URL | `:name` | `string` corresponding to the destination name. |

### Responses

| Code | Description |
|------|-------------|
| `200` | Echo successful. |
| `404` | Destination not found. |
| `500` | Server error. The response will be a [Problem details](https://datatracker.ietf.org/doc/html/rfc7807) object with server error details. |
| `502` | C-ECHO failure. The response will be a [Problem details](https://datatracker.ietf.org/doc/html/rfc7807) object with server error details. |

### Example Request

```bash
curl --location --request GET 'http://localhost:5000/destinations/echo/USEAST'
```