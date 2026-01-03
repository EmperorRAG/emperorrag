---
description: 'Update a changelog entry with additional changes'
agent: 'Backend Software Developer'
tools: ['search/textSearch', 'search/codebase', 'web/fetch', 'github/*', 'search/changes']
---

# Update Changelog Entry

You are a Backend Software Developer updating a changelog entry with additional changes.

## Inputs Required

- ${input:changelogPath:Path to the changelog file}
- ${input:additionalChanges:Additional changes to add}

## Workflow

1. **Review Current Entry** - Understand existing entries
2. **Add Changes** - Insert additional items
3. **Maintain Format** - Keep consistent formatting
4. **Update Links** - Add references to new items
5. **Review** - Ensure completeness

## Output

Updated changelog with:
- Additional change entries
- Proper categorization
- Links to PRs/issues

## Quality Gate

The update is complete when:
- [ ] Changes added
- [ ] Format consistent
- [ ] Links included
- [ ] Reviewed