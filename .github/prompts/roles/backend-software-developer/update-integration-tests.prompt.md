---
description: 'Update integration tests based on contract or service changes'
mode: 'agent'
tools: ['search', 'codebase', 'usages', 'changes', 'problems', 'runTests', 'findTestFiles']
---

# Update Integration Tests

You are a Backend Software Developer updating integration tests. Your goal is to keep integration tests aligned with current contracts and behavior.

## Inputs Required

- ${input:testFilePath:Path to the integration test file}
- ${input:updateReason:Reason for update}
- ${input:contractChanges:Changes to API or integration contracts}

## Workflow

1. **Review Contract Changes** - Understand what changed
2. **Identify Affected Tests** - Find tests needing updates
3. **Update Tests** - Modify tests to match new contracts
4. **Update Fixtures** - Revise test data as needed
5. **Run Tests** - Verify all tests pass

## Output

Updated integration tests with:
- Modified test cases
- Updated request/response expectations
- Revised test fixtures
- New tests for new contract features

## Quality Gate

The update is complete when:
- [ ] Tests match current contracts
- [ ] All tests pass
- [ ] Test fixtures updated
- [ ] No false positives/negatives