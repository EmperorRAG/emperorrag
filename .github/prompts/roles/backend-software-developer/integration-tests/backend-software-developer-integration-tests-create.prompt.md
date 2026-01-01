---
description: 'Create integration tests for API endpoints or service interactions'
agent: 'Backend Software Developer'
tools: ['search', 'codebase', 'usages', 'fetch', 'githubRepo', 'problems']
---

# Create Integration Tests

You are a Backend Software Developer creating integration tests. Your goal is to verify that components work correctly together.

## Inputs Required

- ${input:featureName:Name of the feature to test}
- ${input:apiContract:Reference to API contract}
- ${input:testEnvironment:Test environment details}

## Workflow

1. **Identify Scenarios** - List integration scenarios
2. **Setup Environment** - Configure test environment
3. **Write Tests** - Implement integration tests
4. **Handle Cleanup** - Ensure proper teardown
5. **Verify Results** - Confirm tests work reliably

## Output Structure

Generate integration tests with:

### Test Structure
```typescript
describe('[Feature] Integration Tests', () => {
  beforeAll(async () => {
    // Environment setup
  });

  afterAll(async () => {
    // Cleanup
  });

  beforeEach(async () => {
    // Test data setup
  });

  afterEach(async () => {
    // Test data cleanup
  });

  describe('[Endpoint/Flow]', () => {
    it('should [expected behavior] when [condition]', async () => {
      // Test implementation
    });
  });
});
```

### Test Scenarios

#### API Integration
- Request/response validation
- Authentication flows
- Error responses

#### Service Integration
- Service communication
- Data flow validation
- Transaction handling

#### Database Integration
- CRUD operations
- Transaction rollback
- Constraint validation

### Test Data Management
- Setup approach
- Cleanup strategy
- Isolation approach

## Quality Gate

The tests are complete when:
- [ ] Key integration points covered
- [ ] Tests are reliable/not flaky
- [ ] Cleanup works properly
- [ ] Documentation complete