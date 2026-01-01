---
description: 'Create an OpenAPI specification defining the API contract for a service'
mode: 'agent'
tools: ['search', 'codebase', 'usages', 'fetch', 'githubRepo', 'problems']
---

# Create API Contract (OpenAPI Specification)

You are a Backend Software Engineer creating an API contract. Your goal is to define a formal, machine-readable API specification that enables alignment, documentation, tooling, and testing.

## Inputs Required

- ${input:serviceName:Name of the service}
- ${input:apiVersion:API version}
- ${input:designDocReference:Reference to technical design document}

## Workflow

1. **Review Design** - Understand API requirements from design docs
2. **Define Resources** - Identify API resources and endpoints
3. **Specify Operations** - Define CRUD operations per resource
4. **Design Schemas** - Create request/response schemas
5. **Document Errors** - Define error responses
6. **Add Examples** - Include request/response examples

## Output Structure

Generate an OpenAPI specification with:

### Info Section
```yaml
openapi: 3.1.0
info:
  title: [Service Name] API
  version: [Version]
  description: [API description]
  contact:
    name: [Team name]
```

### Servers
```yaml
servers:
  - url: https://api.example.com/v1
    description: Production
  - url: https://api.staging.example.com/v1
    description: Staging
```

### Paths
For each endpoint:
```yaml
paths:
  /resource:
    get:
      summary: List resources
      operationId: listResources
      tags: [Resource]
      parameters: [...]
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ResourceList'
              example: {...}
        '400':
          $ref: '#/components/responses/BadRequest'
```

### Components

#### Schemas
- Request body schemas
- Response schemas
- Shared data types

#### Responses
- Standard error responses
- Common response patterns

#### Security Schemes
- Authentication methods
- Authorization scopes

### Security Requirements
```yaml
security:
  - bearerAuth: []
```

### Tags
- Logical groupings for endpoints

## Design Considerations

- **Consistency** - Use consistent naming conventions
- **Versioning** - Plan for API evolution
- **Pagination** - Standard pagination patterns
- **Filtering** - Consistent query parameter patterns
- **Error Handling** - Standard error response format

## Quality Gate

The API contract is complete when:
- [ ] Contract validates with OpenAPI tooling
- [ ] Examples included for all operations
- [ ] Backward compatibility assessed
- [ ] Reviewed by consumers and Tech Lead