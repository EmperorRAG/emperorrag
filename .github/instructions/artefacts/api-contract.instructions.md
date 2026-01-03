---
description: 'Template and guidelines for API Contract'
applyTo: '**/api-contract/**/*.md, **/api-contracts/**/*.md, **/*-api-contract.md'
---

# API Contract

An API contract defines the interface between services or components, specifying endpoints, request/response formats, and error handling.

## When to Use

- Defining new API endpoints
- Documenting service interfaces
- Establishing contracts between frontend and backend
- Creating integration specifications

## Template

```markdown
# API Contract: [API/Service Name]

## Overview
- **Base URL**: `/api/v1/[resource]`
- **Version**: [1.0.0]
- **Authentication**: [Bearer Token | API Key | None]
- **Content-Type**: `application/json`

---

## Endpoints

### [HTTP Method] [Endpoint Path]

**Description**: [What this endpoint does]

**Authentication**: [Required | Optional | None]

**Rate Limit**: [X requests per Y seconds]

#### Request

**Headers**:
| Header | Required | Description |
|--------|----------|-------------|
| Authorization | Yes | Bearer token |
| Content-Type | Yes | application/json |

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| [param] | string | Yes | [Description] |

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| [param] | string | No | [default] | [Description] |
| page | number | No | 1 | Page number |
| limit | number | No | 20 | Items per page |

**Request Body**:
```json
{
  "field1": "string",
  "field2": 123,
  "nested": {
    "subField": "value"
  }
}
```

**Request Schema**:
```typescript
interface CreateResourceRequest {
  field1: string;
  field2: number;
  nested?: {
    subField: string;
  };
}
```

#### Response

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "field1": "string",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "meta": {
    "requestId": "uuid"
  }
}
```

**Response Schema**:
```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta: {
    requestId: string;
    timestamp?: string;
  };
}
```

#### Error Responses

**400 Bad Request**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body",
    "details": [
      {
        "field": "field1",
        "message": "Required field is missing"
      }
    ]
  }
}
```

**401 Unauthorized**:
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

**404 Not Found**:
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

**500 Internal Server Error**:
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Request validation failed |
| UNAUTHORIZED | 401 | Missing or invalid authentication |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource already exists |
| RATE_LIMITED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |

---

## Data Models

### [Model Name]

```typescript
interface ResourceModel {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

---

## Examples

### Create Resource

**Request**:
```bash
curl -X POST https://api.example.com/api/v1/resources \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"field1": "value", "field2": 123}'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "field1": "value",
    "createdAt": "2024-01-01T12:00:00Z"
  }
}
```

---

## Versioning

- API version is included in URL path (`/api/v1/`)
- Breaking changes require new major version
- Deprecation notice provided 6 months before removal

---

## Rate Limiting

| Tier | Requests/Minute | Burst |
|------|-----------------|-------|
| Default | 60 | 10 |
| Premium | 300 | 50 |
```

## Quality Criteria

- [ ] All endpoints documented
- [ ] Request/response schemas defined
- [ ] Error codes standardized
- [ ] Authentication requirements specified
- [ ] Examples provided
- [ ] Versioning strategy documented
