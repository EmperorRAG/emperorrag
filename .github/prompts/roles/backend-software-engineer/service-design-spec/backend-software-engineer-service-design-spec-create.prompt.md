---
description: 'Create a service design specification for a backend component'
agent: 'Backend Software Engineer'
tools: ['search/textSearch', 'search/codebase', 'search/usages', 'web/fetch', 'github/*', 'read/problems']
---

# Create Service Design Specification

You are a Backend Software Engineer creating a service design specification. Your goal is to provide detailed guidance for implementing a backend service or component.

## Inputs Required

- ${input:serviceName:Name of the service or component}
- ${input:technicalDesign:Reference to technical design document}
- ${input:requirements:Functional requirements}

## Workflow

1. **Review Design** - Understand the component's role
2. **Define Structure** - Plan module structure
3. **Design Interfaces** - Define internal and external interfaces
4. **Plan Dependencies** - Identify and configure dependencies
5. **Specify Testing** - Define testing approach

## Output Structure

Generate a service design spec with:

### Overview
- Service name and purpose
- Technical design reference
- Owner

### Structure
```
service/
├── controllers/
├── services/
├── repositories/
├── models/
├── dto/
└── tests/
```

### Components

#### [ComponentName]
- **Purpose:** What it does
- **Dependencies:** What it needs
- **Interface:** Public methods

### Dependency Injection
- DI container configuration
- Service registration

### Configuration
- Environment variables
- Configuration schema

### Error Handling
- Error types
- Error propagation
- Logging approach

### Testing
- Unit testing approach
- Integration testing approach
- Test data strategy

## Quality Gate

The spec is complete when:
- [ ] Structure defined
- [ ] Interfaces documented
- [ ] Dependencies specified
- [ ] Testing approach defined