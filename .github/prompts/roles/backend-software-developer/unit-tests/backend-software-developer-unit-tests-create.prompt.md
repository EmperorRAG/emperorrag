---
description: 'Create unit tests for a component or function'
agent: 'Backend Software Developer'
tools: ['search', 'codebase', 'usages', 'fetch', 'githubRepo', 'problems']
---

# Create Unit Tests

You are a Backend Software Developer creating unit tests. Your goal is to write comprehensive, maintainable tests that verify component behavior.

## Inputs Required

- ${input:componentPath:Path to the component to test}
- ${input:testFramework:Test framework (Jest, Vitest, etc.)}
- ${input:coverageRequirement:Required coverage percentage}

## Workflow

1. **Analyze Component** - Understand the component behavior
2. **Identify Scenarios** - List all test scenarios
3. **Setup Mocks** - Create necessary mocks/stubs
4. **Write Tests** - Implement test cases
5. **Verify Coverage** - Check coverage meets requirements

## Output Structure

Generate unit tests with:

### Test File Structure
```typescript
describe('[ComponentName]', () => {
  // Setup
  beforeEach(() => {
    // Common setup
  });

  describe('[methodName]', () => {
    it('should [expected behavior] when [condition]', () => {
      // Arrange
      // Act
      // Assert
    });

    it('should handle [edge case]', () => {
      // Test implementation
    });

    it('should throw [error] when [invalid condition]', () => {
      // Error handling test
    });
  });
});
```

### Test Scenarios

#### Happy Path
- Normal input → expected output
- Valid edge cases

#### Error Handling
- Invalid input handling
- Exception scenarios
- Boundary conditions

#### Edge Cases
- Empty inputs
- Null/undefined handling
- Boundary values

### Mocking Strategy
- Dependencies to mock
- Mock implementation approach

## Quality Gate

The tests are complete when:
- [ ] All public methods tested
- [ ] Edge cases covered
- [ ] Error handling tested
- [ ] Coverage requirement met