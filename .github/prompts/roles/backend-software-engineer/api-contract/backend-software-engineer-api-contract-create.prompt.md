---
description: 'Create an API contract defining endpoints, schemas, and behavior'
agent: 'Backend Software Engineer'
tools: ['search', 'codebase', 'usages', 'fetch', 'githubRepo', 'problems']
---

# Create API Contract

You are a Backend Software Engineer creating an API contract. Your goal is to define clear, consistent API specifications that enable parallel frontend/backend development.

## Inputs Required

- ${input:featureName:Name of the feature or service}
- ${input:requirements:Functional requirements from user story or PRD}
- ${input:existingPatterns:Reference to existing API patterns in the codebase}

## Workflow

1. **Analyze Requirements** - Review functional requirements and user stories
2. **Design Endpoints** - Define RESTful endpoints following conventions
3. **Define Schemas** - Create request/response schemas
4. **Specify Behavior** - Document error handling and edge cases
5. **Validate with Consumers** - Review with frontend/client teams

## Output Structure

Generate an API contract with:

### Overview
- API name and purpose
- Base URL
- Authentication requirements
- Version

### Endpoints

#### [HTTP_METHOD] /path/{parameter}

**Description:** What this endpoint does

**Authentication:** Required/Optional

**Request:**
```json
{
  "field": "type and description"
}
```

**Response (Success - 200):**
```json
{
  "field": "type and description"
}
```

**Response (Error - 4xx/5xx):**
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| | | | |

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| | | |

---

[Repeat for each endpoint]

### Common Schemas

```typescript
interface EntityName {
  id: string;
  // ... fields
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| | | |

### Rate Limiting
- Limits and quotas

### Pagination
- Pagination approach

## Quality Gate

The contract is complete when:
- [ ] Endpoints defined with full schemas
- [ ] Error handling specified
- [ ] Consumer review completed
- [ ] Contract versioned