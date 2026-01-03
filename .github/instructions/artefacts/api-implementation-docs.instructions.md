---
description: 'Template and guidelines for API Implementation Documentation'
applyTo: '**/api-implementation-docs/**/*.md, **/*-api-implementation-docs.md'
---

# API Implementation Documentation

API implementation documentation helps developers understand and use the API implementation, including code organization, usage patterns, and extension points.

## When to Use

- Documenting how an API is implemented internally
- Helping developers understand code architecture
- Enabling other developers to extend or maintain the API

## Template

```markdown
# API Implementation Documentation: [API Name]

## Overview

- **API Name**: [Name]
- **Contract Reference**: [Link to API contract]
- **Implementation Location**: [Path to implementation code]
- **Owner**: [Team/Individual]
- **Last Updated**: [Date]

---

## Architecture

### Module Structure

```
src/
├── controllers/
│   └── [feature].controller.ts
├── services/
│   └── [feature].service.ts
├── repositories/
│   └── [feature].repository.ts
├── models/
│   └── [feature].model.ts
├── dto/
│   ├── [feature]-request.dto.ts
│   └── [feature]-response.dto.ts
└── tests/
    └── [feature].spec.ts
```

### Key Components

| Component | Responsibility | Location |
|-----------|---------------|----------|
| [Controller] | [HTTP request handling] | [Path] |
| [Service] | [Business logic] | [Path] |
| [Repository] | [Data access] | [Path] |

### Dependencies

| Dependency | Purpose | Version |
|------------|---------|---------|
| [Package] | [Why needed] | [Version] |

---

## Usage

### Basic Usage

```typescript
// Example: Basic API call
import { FeatureService } from './services/feature.service';

const service = new FeatureService();
const result = await service.performAction(input);
```

### Advanced Usage

```typescript
// Example: Advanced configuration
const service = new FeatureService({
  option1: value1,
  option2: value2,
});
```

---

## Extension Points

### How to Add New Endpoints

1. [Step 1]
2. [Step 2]
3. [Step 3]

### Customization Options

| Option | Description | Default |
|--------|-------------|---------|
| [Option] | [Description] | [Default] |

---

## Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| [VAR_NAME] | [Description] | [Yes/No] | [Default] |

### Configuration Files

| File | Purpose |
|------|---------|
| [File] | [Purpose] |

---

## Error Handling

### Error Types

| Error Type | HTTP Status | When Thrown |
|------------|-------------|-------------|
| ValidationError | 400 | Invalid input |
| NotFoundError | 404 | Resource not found |
| [Custom Error] | [Status] | [Condition] |

### Error Response Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {}
  }
}
```

---

## Testing

### Running Tests

```bash
npm test -- --testPathPattern=[feature]
```

### Mock Strategies

| Component | Mock Approach |
|-----------|---------------|
| [Service] | [How to mock] |
| [External API] | [How to mock] |

### Test Data

| Scenario | Test Data Location |
|----------|-------------------|
| [Scenario] | [Location] |

---

## Gotchas & Common Pitfalls

- **[Pitfall 1]**: [Description and how to avoid]
- **[Pitfall 2]**: [Description and how to avoid]
- **[Pitfall 3]**: [Description and how to avoid]

---

## Related Documentation

- [API Contract](link)
- [Technical Design Doc](link)
- [Runbook](link)
```

## Quality Criteria

- [ ] Architecture clearly explained
- [ ] Usage examples are working and tested
- [ ] All extension points documented
- [ ] Configuration options complete
- [ ] Error handling documented
- [ ] Testing approach explained
- [ ] Common pitfalls documented
