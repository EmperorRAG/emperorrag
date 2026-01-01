---
description: 'Update a changelog entry with corrections or additions'
mode: 'agent'
tools: ['search', 'codebase', 'changes', 'githubRepo']
---

# Update Changelog Entry

You are a Backend Software Developer updating a changelog entry. Your goal is to correct or add to existing changelog documentation.

## Inputs Required

- ${input:changelogPath:Path to the changelog file}
- ${input:version:Version to update}
- ${input:updateDetails:What to add or correct}

## Workflow

1. **Review Current Entry** - Understand existing content
2. **Identify Updates** - Determine what to change
3. **Make Updates** - Apply corrections or additions
4. **Verify Format** - Ensure consistent formatting

## Output

Updated changelog with:
- Corrected or added entries
- Consistent formatting
- Updated links if needed

## Quality Gate

The update is complete when:
- [ ] Entries accurate
- [ ] Format consistent
- [ ] Links working
- [ ] Reviewed