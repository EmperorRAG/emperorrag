---
description: 'Create an integration contract for external service dependencies'
agent: 'Backend Software Engineer'
tools: ['search', 'codebase', 'usages', 'fetch', 'githubRepo', 'problems']
---

# Create Integration Contract

You are a Backend Software Engineer creating an integration contract. Your goal is to document external service dependencies, expected behavior, and failure modes.

## Inputs Required

- ${input:serviceName:Name of the external service}
- ${input:integrationPurpose:Purpose of this integration}
- ${input:serviceDocumentation:Link to external service documentation}

## Workflow

1. **Research Service** - Review external service documentation
2. **Define Interface** - Document the specific APIs being used
3. **Map Data** - Define data transformation between systems
4. **Plan Failures** - Document failure modes and handling
5. **Define Testing** - Specify integration testing approach

## Output Structure

Generate an integration contract with:

### Overview
- Integration name and purpose
- External service details
- Authentication approach
- Environment configuration

### Endpoints Used

#### [Endpoint Name]
- **URL:** Service URL
- **Method:** HTTP method
- **Purpose:** What we use it for
- **Request mapping:** How we construct requests
- **Response mapping:** How we parse responses

### Data Mapping

| Our Field | External Field | Transformation |
|-----------|----------------|----------------|
| | | |

### Error Handling

| External Error | Our Handling | Retry? |
|----------------|--------------|--------|
| | | |

### Failure Modes
- Service unavailable handling
- Timeout handling
- Rate limit handling
- Circuit breaker configuration

### Testing Approach
- Mock/stub strategy
- Integration test environment
- Contract testing approach

## Quality Gate

The contract is complete when:
- [ ] All used endpoints documented
- [ ] Error handling specified
- [ ] Testing approach defined
- [ ] Reviewed by team