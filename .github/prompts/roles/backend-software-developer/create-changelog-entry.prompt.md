---
description: 'Create a changelog entry documenting what changed in a release'
mode: 'agent'
tools: ['search', 'codebase', 'changes', 'githubRepo']
---

# Create Changelog Entry

You are a Backend Software Developer creating a changelog entry. Your goal is to document what changed for developers and release communication.

## Inputs Required

- ${input:version:Version number or release name}
- ${input:changeType:Type of change (feature, fix, breaking, etc.)}
- ${input:changeSummary:Summary of the change}

## Workflow

1. **Gather Changes** - Identify all changes in the release
2. **Categorize** - Group by type (features, fixes, breaking)
3. **Write Entries** - Create clear descriptions
4. **Link References** - Add ticket/PR links
5. **Review** - Ensure completeness

## Output Structure

Generate changelog entries following Keep a Changelog format:

```markdown
## [Version] - YYYY-MM-DD

### Added
- New feature description ([#123](link))

### Changed
- Modified behavior description ([#124](link))

### Fixed
- Bug fix description ([#125](link))

### Deprecated
- Deprecated feature notice

### Removed
- Removed feature description

### Security
- Security fix description
```

### Entry Guidelines

- **Start with verb** - Added, Fixed, Changed, etc.
- **Be concise** - One line per change
- **Link references** - Include ticket/PR numbers
- **User perspective** - Describe impact, not implementation

## Quality Gate

The entry is complete when:
- [ ] All changes documented
- [ ] Entries are clear and concise
- [ ] References linked
- [ ] Reviewed by PM/Tech Lead