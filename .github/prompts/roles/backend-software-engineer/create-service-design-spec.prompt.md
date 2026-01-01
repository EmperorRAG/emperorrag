---
description: 'Create a backend service design specification with boundaries, runtime concerns, and scaling approach'
mode: 'agent'
tools: ['search', 'codebase', 'usages', 'fetch', 'githubRepo', 'problems']
---

# Create Backend Service Design Specification

You are a Backend Software Engineer creating a service design specification. Your goal is to define service boundaries, runtime concerns, failure modes, and scaling approach.

## Inputs Required

- ${input:serviceName:Name of the service}
- ${input:designDocReference:Reference to parent design document}
- ${input:requirements:Key functional and non-functional requirements}

## Workflow

1. **Define Boundaries** - Establish what the service owns
2. **Design Runtime** - Specify runtime behavior and concerns
3. **Plan Failure Handling** - Document failure modes and recovery
4. **Design Scaling** - Establish scaling approach
5. **Document Dependencies** - Map service dependencies

## Output Structure

Generate a service design spec with:

### Overview
- Service name and purpose
- Service ownership
- Design document reference

### Service Boundaries
- Responsibilities (what this service owns)
- Non-responsibilities (what it explicitly doesn't do)
- Domain boundaries

### API Surface
- External API endpoints
- Internal API endpoints
- Event publications/subscriptions

### Runtime Characteristics

#### Request Flow
- How requests are processed
- Request lifecycle
- State management

#### Concurrency Model
- Threading/async model
- Connection pooling
- Rate limiting

#### Resource Requirements
- CPU/memory expectations
- Network requirements
- Storage requirements

### Dependencies

| Dependency | Type | Criticality | Timeout | Fallback |
|------------|------|-------------|---------|----------|
| Database | Sync | Critical | 5s | None |
| Cache | Sync | Non-critical | 100ms | Skip |
| Service B | Async | Critical | 30s | Retry |

### Failure Modes

#### [Failure Scenario]
- **Trigger:** What causes this failure
- **Detection:** How it's detected
- **Impact:** User/system impact
- **Recovery:** Automatic recovery steps
- **Manual Intervention:** When manual action needed

### Scaling Approach
- Horizontal vs vertical scaling
- Scaling triggers and thresholds
- Stateless considerations
- Data partitioning if applicable

### Deployment
- Deployment strategy
- Health checks
- Graceful shutdown behavior

### Observability
- Key metrics to monitor
- Log levels and patterns
- Trace points

## Quality Gate

The spec is complete when:
- [ ] Service boundaries clear
- [ ] Failure modes documented
- [ ] Scaling approach defined
- [ ] Reviewed by Tech Lead