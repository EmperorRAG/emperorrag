---
description: 'Template and guidelines for Pull Request'
applyTo: '**/pull-request/**/*.md, **/pull-requests/**/*.md, **/*-pull-request.md'
---

# Pull Request

A pull request describes code changes, their purpose, testing approach, and provides reviewers with context for effective review.

## When to Use

- Submitting code for review
- Documenting implementation decisions
- Providing context for code changes
- Creating merge requests

## Template

```markdown
# [Type]: [Brief Description]

## Summary

[Concise description of what this PR accomplishes]

---

## Related Items

- **Story/Task**: [STORY-XXX](link)
- **Epic**: [EPIC-XXX](link)
- **Design Doc**: [Link to design doc]
- **ADR**: [Link to relevant ADR]

---

## Type of Change

- [ ] Ì∞õ Bug fix (non-breaking change that fixes an issue)
- [ ] ‚ú® New feature (non-breaking change that adds functionality)
- [ ] Ì≤• Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Ì≥ù Documentation update
- [ ] ‚ôªÔ∏è Refactoring (no functional changes)
- [ ] Ì∑™ Test update
- [ ] Ì¥ß Configuration change

---

## Changes Made

### Added
- [New file/feature/capability]

### Changed
- [Modified behavior/component]

### Removed
- [Deleted file/feature]

### Fixed
- [Bug that was fixed]

---

## Implementation Details

### Approach
[Explain the technical approach taken and why]

### Key Decisions
- [Decision 1 and rationale]
- [Decision 2 and rationale]

### Trade-offs
- [Trade-off made and reasoning]

---

## Testing

### Automated Tests
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated

### Manual Testing
| Scenario | Steps | Result |
|----------|-------|--------|
| [Scenario 1] | [Steps taken] | ‚úÖ Pass |
| [Scenario 2] | [Steps taken] | ‚úÖ Pass |

### Test Commands
```bash
# Run unit tests
npx nx test [project]

# Run specific tests
npx nx test [project] -- --testPathPattern="[pattern]"
```

---

## Screenshots/Recordings

[Before/After screenshots for UI changes]

| Before | After |
|--------|-------|
| [Screenshot] | [Screenshot] |

---

## Checklist

### Code Quality
- [ ] Code follows project style guidelines
- [ ] Self-reviewed my own code
- [ ] No console.log or debug statements
- [ ] No TODO comments without linked issues
- [ ] Error handling implemented appropriately

### Documentation
- [ ] Code comments added where necessary
- [ ] TSDoc/JSDoc updated for public APIs
- [ ] README updated if needed
- [ ] Changelog entry added

### Testing
- [ ] Tests pass locally
- [ ] New code has test coverage
- [ ] Edge cases considered and tested

### Security
- [ ] No secrets or credentials in code
- [ ] Input validation implemented
- [ ] Authorization checks in place

---

## Deployment Notes

### Database Changes
- [ ] No database changes
- [ ] Migration scripts included
- [ ] Migration tested and reversible

### Configuration Changes
- [ ] No configuration changes
- [ ] Environment variables documented
- [ ] Feature flags configured

### Rollback Plan
[How to rollback if issues arise]

---

## Reviewer Notes

[Specific areas to focus on during review]

- Please pay attention to [specific area]
- I'm uncertain about [specific decision]
- Feedback welcome on [specific approach]

---

## Post-Merge Tasks

- [ ] Monitor logs for errors
- [ ] Verify in staging environment
- [ ] Update documentation
- [ ] Notify stakeholders
```

## PR Title Convention

Format: `[type]: [description]`

| Type | Description |
|------|-------------|
| feat | New feature |
| fix | Bug fix |
| docs | Documentation |
| refactor | Code refactoring |
| test | Test updates |
| chore | Maintenance |

## Quality Criteria

- [ ] Title follows convention
- [ ] Summary clearly explains purpose
- [ ] Related items linked
- [ ] Testing documented
- [ ] Checklist completed
- [ ] Reviewer guidance provided
