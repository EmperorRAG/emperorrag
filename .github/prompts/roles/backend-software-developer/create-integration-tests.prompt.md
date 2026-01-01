---
description: 'Create integration tests that verify service boundaries and contracts'
mode: 'agent'
tools: ['search', 'codebase', 'usages', 'problems', 'runTests', 'findTestFiles']
---

# Create Integration Tests

You are a Backend Software Developer creating integration tests. Your goal is to verify that components work together correctly and contracts are honored.

## Inputs Required

- ${input:integrationScope:Scope of integration (API, database, service-to-service)}
- ${input:apiContractReference:Reference to API or integration contract}
- ${input:testEnvironment:Test environment requirements}

## Workflow

1. **Identify Integration Points** - Determine what to test
2. **Setup Test Environment** - Configure test dependencies
3. **Write Integration Tests** - Create tests for integrations
4. **Verify Contracts** - Ensure contracts are honored
5. **Run Tests** - Execute in test environment

## Output Structure

Generate integration tests:

```typescript
describe('[Integration Name] Integration', () => {
  // Environment setup
  beforeAll(async () => {
    // Start test dependencies (database, services, etc.)
  });

  afterAll(async () => {
    // Cleanup
  });

  describe('API Contract', () => {
    it('should return expected response for valid request', async () => {
      // Arrange
      const request = { ... };

      // Act
      const response = await apiClient.post('/endpoint', request);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toMatchSchema(expectedSchema);
    });

    it('should return 400 for invalid request', async () => {
      // Test error handling
    });
  });

  describe('Database Integration', () => {
    it('should persist data correctly', async () => {
      // Test data persistence
    });
  });

  describe('Service Integration', () => {
    it('should communicate with dependent service', async () => {
      // Test service-to-service communication
    });
  });
});
```

### Test Categories

#### API Integration
- Request/response validation
- Authentication/authorization
- Error handling
- Rate limiting

#### Database Integration
- CRUD operations
- Transaction handling
- Query correctness

#### Service Integration
- Message/event handling
- Timeout behavior
- Fallback behavior

## Quality Gate

The tests are complete when:
- [ ] Pass against test environment
- [ ] Cover service boundaries/contracts
- [ ] Error scenarios tested
- [ ] Can run in CI pipeline