---
description: 'Template and guidelines for Unit Tests'
applyTo: '**/unit-tests/**/*.md, **/*-unit-tests.md, **/*.spec.ts, **/*.test.ts'
---

# Unit Tests

Unit tests verify individual functions, methods, or components in isolation with mocked dependencies.

## When to Use

- Testing pure functions
- Testing class methods
- Testing React components
- Validating business logic

## Template

```markdown
# Unit Tests: [Module/Component Name]

## Test Coverage Goals

| Metric | Target | Current |
|--------|--------|---------|
| Statement | >80% | [X]% |
| Branch | >75% | [X]% |
| Function | >80% | [X]% |
| Line | >80% | [X]% |

---

## Test Suites

### [Function/Component Name]

#### Happy Path Tests
| Test | Description | Priority |
|------|-------------|----------|
| should [expected behavior] when [condition] | [Description] | P0 |
| should return [value] for valid input | [Description] | P0 |

#### Edge Cases
| Test | Description | Priority |
|------|-------------|----------|
| should handle empty input | [Description] | P1 |
| should handle null/undefined | [Description] | P1 |
| should handle boundary values | [Description] | P1 |

#### Error Cases
| Test | Description | Priority |
|------|-------------|----------|
| should throw [Error] when [condition] | [Description] | P0 |
| should return error for invalid input | [Description] | P0 |
```

---

## Jest/Vitest Pattern

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { functionUnderTest } from './module';

describe('functionUnderTest', () => {
  // Setup
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('when called with valid input', () => {
    it('should return expected result', () => {
      // Arrange
      const input = { field: 'value' };
      const expected = { result: 'expected' };

      // Act
      const result = functionUnderTest(input);

      // Assert
      expect(result).toEqual(expected);
    });

    it('should call dependency with correct args', () => {
      // Arrange
      const mockDep = vi.fn().mockReturnValue('mocked');
      const input = { field: 'value' };

      // Act
      functionUnderTest(input, mockDep);

      // Assert
      expect(mockDep).toHaveBeenCalledWith('expected-arg');
      expect(mockDep).toHaveBeenCalledTimes(1);
    });
  });

  describe('when called with invalid input', () => {
    it('should throw ValidationError', () => {
      // Arrange
      const invalidInput = { field: '' };

      // Act & Assert
      expect(() => functionUnderTest(invalidInput))
        .toThrow('Validation failed');
    });
  });

  describe('edge cases', () => {
    it.each([
      [null, 'default'],
      [undefined, 'default'],
      ['', 'default'],
    ])('should return %s for input %s', (input, expected) => {
      expect(functionUnderTest(input)).toBe(expected);
    });
  });
});
```

---

## React Component Pattern

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ComponentUnderTest } from './Component';

describe('ComponentUnderTest', () => {
  const defaultProps = {
    title: 'Test Title',
    onSubmit: vi.fn(),
  };

  it('should render with provided props', () => {
    render(<ComponentUnderTest {...defaultProps} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should call onSubmit when button clicked', async () => {
    render(<ComponentUnderTest {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
  });

  it('should display error message on validation failure', () => {
    render(<ComponentUnderTest {...defaultProps} showError />);

    expect(screen.getByRole('alert')).toHaveTextContent('Error message');
  });
});
```

---

## Effect-TS Pattern

```typescript
import { describe, it, expect } from 'vitest';
import { Effect, Exit, Option } from 'effect';
import { effectFunction } from './effect-module';

describe('effectFunction', () => {
  it('should succeed with expected value', async () => {
    const result = await Effect.runPromise(effectFunction('valid'));

    expect(result).toEqual({ success: true });
  });

  it('should fail with expected error', async () => {
    const exit = await Effect.runPromiseExit(effectFunction('invalid'));

    expect(Exit.isFailure(exit)).toBe(true);
  });

  it('should return Option.some for existing value', async () => {
    const result = await Effect.runPromise(findById('123'));

    expect(Option.isSome(result)).toBe(true);
    expect(Option.getOrThrow(result)).toEqual({ id: '123' });
  });
});
```

---

## Mocking Patterns

### Module Mock

```typescript
vi.mock('./dependency', () => ({
  dependencyFn: vi.fn().mockReturnValue('mocked'),
}));
```

### Spy on Method

```typescript
const spy = vi.spyOn(object, 'method').mockImplementation(() => 'mocked');
```

### Mock Timer

```typescript
vi.useFakeTimers();
vi.advanceTimersByTime(1000);
vi.useRealTimers();
```

## Quality Criteria

- [ ] Tests follow AAA pattern (Arrange-Act-Assert)
- [ ] Each test has single responsibility
- [ ] Mocks properly reset between tests
- [ ] Edge cases covered
- [ ] Error scenarios tested
- [ ] Test names describe behavior
