---
description: 'Create API implementation documentation for developers'
agent: 'Backend Software Developer'
tools: ['search', 'codebase', 'usages', 'fetch', 'githubRepo', 'problems']
---

# Create API Implementation Documentation

You are a Backend Software Developer creating API implementation documentation. Your goal is to help other developers understand and use the API implementation.

## Inputs Required

- ${input:apiName:Name of the API}
- ${input:apiContract:Reference to API contract}
- ${input:implementationPath:Path to implementation code}

## Workflow

1. **Review Implementation** - Understand the code
2. **Document Structure** - Explain code organization
3. **Document Usage** - Show how to use/extend
4. **Add Examples** - Include code examples
5. **Document Gotchas** - Note important considerations

## Output Structure

Generate implementation documentation with:

### Overview
- API purpose
- Contract reference
- Implementation location

### Architecture
- Module structure
- Key components
- Dependencies

### Usage

#### Basic Usage
```typescript
// Example code
```

#### Advanced Usage
```typescript
// Advanced example
```

### Extension Points
- How to extend
- Customization options

### Configuration
- Configuration options
- Environment variables

### Error Handling
- Error types
- How to handle errors

### Testing
- How to test
- Mock strategies

### Gotchas
- Common pitfalls
- Important considerations

## Quality Gate

The documentation is complete when:
- [ ] Architecture explained
- [ ] Usage examples provided
- [ ] Gotchas documented
- [ ] Reviewed by peers