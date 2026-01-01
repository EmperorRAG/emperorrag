---
description: 'Update existing unit tests based on code changes or new requirements'
mode: 'agent'
tools: ['search', 'codebase', 'usages', 'changes', 'problems', 'runTests', 'findTestFiles']
---

# Update Unit Tests

You are a Backend Software Developer updating unit tests. Your goal is to maintain test coverage and correctness as code evolves.

## Inputs Required

- ${input:testFilePath:Path to the test file}
- ${input:updateReason:Reason for update (code change, new requirement, bug fix)}
- ${input:changesDescription:Description of what changed}

## Workflow

1. **Review Changes** - Understand what code changed
2. **Identify Affected Tests** - Find tests that need updating
3. **Update Tests** - Modify or add tests
4. **Verify Coverage** - Ensure coverage maintained
5. **Run Tests** - Confirm all tests pass

## Update Types

- **Code Changes** - Update tests to match new behavior
- **Bug Fixes** - Add tests that would have caught the bug
- **New Requirements** - Add tests for new functionality
- **Refactoring** - Ensure tests still verify correct behavior

## Output

Updated test file with:
- Modified test cases
- New test cases if needed
- Removed obsolete tests
- Updated mocks/fixtures

## Quality Gate

The update is complete when:
- [ ] Tests match current code behavior
- [ ] Coverage maintained or improved
- [ ] All tests pass
- [ ] No flaky tests introduced