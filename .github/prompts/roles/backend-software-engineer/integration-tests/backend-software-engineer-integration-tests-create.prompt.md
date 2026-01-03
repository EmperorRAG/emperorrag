---
description: 'Create integration tests for service boundaries and contracts'
agent: 'Backend Software Engineer'
tools: ['search/textSearch', 'search/codebase', 'search/usages', 'web/fetch', 'github/*', 'read/problems']
---

# Create Integration Tests

You are a Backend Software Engineer creating integration tests. Your goal is to verify that services work correctly together at their boundaries.

## Inputs Required

- ${input:serviceName:Name of the service to test}
- ${input:contracts:API and integration contracts}
- ${input:testEnvironment:Test environment details}

## Workflow

1. **Identify Boundaries** - Map service integration points
2. **Design Test Scenarios** - Plan integration scenarios
3. **Setup Environment** - Configure test environment
4. **Implement Tests** - Write integration tests
5. **Validate Reliability** - Ensure tests are stable

## Output Structure

Generate integration tests with:

### Test Structure
```typescript
describe('[Service] Integration Tests', () => {
  beforeAll(async () => {
    // Environment setup
  });

  afterAll(async () => {
    // Cleanup
  });

  describe('Contract Verification', () => {
    it('should meet API contract for [endpoint]', async () => {
      // Contract test
    });
  });

  describe('Service Boundary', () => {
    it('should handle [integration scenario]', async () => {
      // Boundary test
    });
  });
});
```

### Test Scenarios

#### Contract Tests
- API contract verification
- Schema validation
- Error response verification

#### Boundary Tests
- Service communication
- Data flow validation
- Failure handling

#### Data Integrity
- Transaction handling
- Consistency checks

### Environment Setup
- Dependencies required
- Configuration needed
- Test data approach

## Quality Gate

The tests are complete when:
- [ ] Service boundaries covered
- [ ] Contracts verified
- [ ] Tests are reliable
- [ ] Documentation complete