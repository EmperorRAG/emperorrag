---
description: 'Create a changelog entry for a release or feature'
agent: 'Backend Software Developer'
tools: ['search', 'codebase', 'fetch', 'githubRepo', 'changes']
---

# Create Changelog Entry

You are a Backend Software Developer creating a changelog entry. Your goal is to document changes clearly for users and developers.

## Inputs Required

- ${input:version:Version number}
- ${input:releaseDate:Release date}
- ${input:changesSummary:Summary of changes to document}

## Workflow

1. **Gather Changes** - List all changes since last release
2. **Categorize** - Group changes by type
3. **Write Entries** - Create clear descriptions
4. **Link References** - Add links to PRs/issues
5. **Review** - Ensure completeness

## Output Structure

Generate a changelog entry following Keep a Changelog format:

```markdown
## [VERSION] - YYYY-MM-DD

### Added
- New feature description ([#PR](link))
- Another new feature ([#PR](link))

### Changed
- Change description ([#PR](link))
- Behavior change ([#PR](link))

### Deprecated
- Feature being deprecated

### Removed
- Removed feature

### Fixed
- Bug fix description ([#PR](link))
- Another fix ([#PR](link))

### Security
- Security fix description
```

## Quality Gate

The changelog is complete when:
- [ ] All changes documented
- [ ] Changes categorized correctly
- [ ] PR/issue links added
- [ ] User-friendly descriptions