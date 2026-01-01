---
description: 'Template and guidelines for Integration Contract'
applyTo: '**/integration-contract/**/*.md, **/*-integration-contract.md'
---

# Integration Contract

An integration contract documents external service dependencies, expected behavior, data mappings, and failure handling strategies.

## When to Use

- Integrating with external APIs or services
- Documenting third-party dependencies
- Establishing contract testing requirements
- Planning for failure scenarios

## Template

```markdown
# Integration Contract: [External Service Name]

## Overview

- **Integration Name**: [Name]
- **External Service**: [Service Name]
- **Service Provider**: [Provider/Vendor]
- **Purpose**: [Why we integrate]
- **Owner**: [Team/Individual]
- **Last Updated**: [Date]

---

## Service Details

### Authentication

| Aspect | Details |
|--------|---------|
| **Method** | [OAuth2/API Key/JWT/etc.] |
| **Credentials Location** | [Environment variable names] |
| **Token Refresh** | [Strategy for token refresh] |
| **Rate Limits** | [Requests per minute/hour] |

### Environments

| Environment | Base URL | Notes |
|-------------|----------|-------|
| Development | [URL] | [Notes] |
| Staging | [URL] | [Notes] |
| Production | [URL] | [Notes] |

---

## Endpoints Used

### [Endpoint 1 Name]

- **URL**: `[HTTP Method] /path/to/endpoint`
- **Purpose**: [What we use it for]
- **Frequency**: [How often called]

#### Request

```http
POST /api/v1/resource HTTP/1.1
Host: external-service.com
Authorization: Bearer {token}
Content-Type: application/json

{
  "field1": "value1",
  "field2": "value2"
}
```

#### Response (Success)

```json
{
  "id": "12345",
  "status": "created",
  "data": {}
}
```

#### Response (Error)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Field X is required"
  }
}
```

---

### [Endpoint 2 Name]

[Repeat structure for each endpoint]

---

## Data Mapping

### Request Mapping (Our System → External)

| Our Field | External Field | Transformation | Notes |
|-----------|----------------|----------------|-------|
| `userId` | `user_id` | Direct | Required |
| `createdAt` | `created_at` | ISO 8601 format | |
| `status` | `state` | Map: active→ACTIVE | |

### Response Mapping (External → Our System)

| External Field | Our Field | Transformation | Notes |
|----------------|-----------|----------------|-------|
| `id` | `externalId` | Direct | Store for reference |
| `created_at` | `createdAt` | Parse ISO 8601 | |

---

## Error Handling

### Error Code Mapping

| External Error | HTTP Status | Our Handling | Retry? |
|----------------|-------------|--------------|--------|
| `VALIDATION_ERROR` | 400 | Log, return validation error | No |
| `NOT_FOUND` | 404 | Return not found | No |
| `RATE_LIMITED` | 429 | Exponential backoff | Yes |
| `SERVER_ERROR` | 500 | Log, return service error | Yes (3x) |

### Failure Modes

| Scenario | Detection | Handling | Fallback |
|----------|-----------|----------|----------|
| Service unavailable | Connection timeout | Retry with backoff | [Fallback strategy] |
| Slow response | Response timeout (30s) | Abort, retry | [Fallback strategy] |
| Rate limited | 429 status | Wait, retry | Queue for later |
| Invalid response | Schema validation | Log, alert | Return error |

### Circuit Breaker Configuration

| Parameter | Value |
|-----------|-------|
| Failure threshold | 5 failures in 60 seconds |
| Open duration | 30 seconds |
| Half-open requests | 3 |
| Success threshold | 2 consecutive |

---

## Testing Approach

### Mock/Stub Strategy

| Environment | Approach |
|-------------|----------|
| Unit tests | Mock HTTP client |
| Integration tests | Stub server (WireMock/nock) |
| Staging | Sandbox environment |

### Contract Tests

```typescript
// Example contract test
describe('External Service Contract', () => {
  it('should accept valid request format', async () => {
    // Test that our request matches expected schema
  });
  
  it('should handle success response', async () => {
    // Test response parsing
  });
  
  it('should handle error response', async () => {
    // Test error handling
  });
});
```

### Test Data

| Scenario | Test Data |
|----------|-----------|
| Success case | [Test data or fixture location] |
| Error case | [Test data or fixture location] |

---

## Monitoring & Alerting

| Metric | Threshold | Alert |
|--------|-----------|-------|
| Error rate | > 5% | Page on-call |
| Latency p99 | > 2s | Notify team |
| Availability | < 99% | Page on-call |

---

## Change Management

### Versioning

- **Current API Version**: [v1, v2, etc.]
- **Deprecation Policy**: [Provider's policy]
- **Upgrade Path**: [How to handle version changes]

### Notification Channels

- [Provider's status page]
- [Email list for updates]
- [Slack channel]

---

## Related Documentation

- [External Service Documentation](link)
- [Our API Contract](link)
- [Runbook](link)
```

## Quality Criteria

- [ ] All used endpoints documented
- [ ] Data mappings complete and accurate
- [ ] Error handling specified for all scenarios
- [ ] Testing approach defined
- [ ] Monitoring configured
- [ ] Reviewed by team
