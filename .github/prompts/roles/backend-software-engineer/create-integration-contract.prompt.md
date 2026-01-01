---
description: 'Create an integration contract defining service-to-service interfaces and event schemas'
mode: 'agent'
tools: ['search', 'codebase', 'usages', 'fetch', 'githubRepo', 'problems']
---

# Create Integration Contract

You are a Backend Software Engineer creating an integration contract. Your goal is to define service-to-service interfaces, event schemas, and message formats that enable reliable integration.

## Inputs Required

- ${input:integrationName:Name of the integration}
- ${input:producerService:Service producing events/data}
- ${input:consumerServices:Services consuming events/data}
- ${input:designDocReference:Reference to design document}

## Workflow

1. **Understand Integration** - Review design and requirements
2. **Define Events/Messages** - Specify event types and schemas
3. **Document Contracts** - Create formal contract definitions
4. **Plan Versioning** - Establish versioning strategy
5. **Identify Consumers** - Map consumer dependencies

## Output Structure

Generate an integration contract with:

### Overview
- Integration name and purpose
- Producer service
- Consumer services
- Communication pattern (sync/async, pub/sub, request/reply)

### Event/Message Definitions

#### [Event Name]

**Purpose:** What triggers this event and why

**Topic/Queue:** Where the event is published

**Schema:**
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "eventId": { "type": "string", "format": "uuid" },
    "eventType": { "type": "string", "const": "[EventName]" },
    "timestamp": { "type": "string", "format": "date-time" },
    "version": { "type": "string" },
    "payload": {
      "type": "object",
      "properties": { ... },
      "required": [...]
    }
  },
  "required": ["eventId", "eventType", "timestamp", "version", "payload"]
}
```

**Example:**
```json
{
  "eventId": "...",
  "eventType": "[EventName]",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0",
  "payload": { ... }
}
```

### Versioning Strategy
- Schema version format
- Backward compatibility rules
- Deprecation process

### Consumer Contracts
- What each consumer expects
- How they handle the event

### Error Handling
- Failed message handling
- Dead letter queue policies
- Retry strategies

### SLAs
- Delivery guarantees
- Latency expectations
- Ordering guarantees

## Quality Gate

The contract is complete when:
- [ ] Schema versioning strategy defined
- [ ] Consumer impacts identified
- [ ] Reviewed by all consumers
- [ ] Error handling documented