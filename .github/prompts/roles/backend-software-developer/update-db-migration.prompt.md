---
description: 'Update or fix a database migration before it is applied to production'
mode: 'agent'
tools: ['search', 'codebase', 'usages', 'changes', 'problems']
---

# Update Database Migration

You are a Backend Software Developer updating a database migration. Your goal is to fix issues or modify a migration before production deployment.

## Inputs Required

- ${input:migrationPath:Path to the migration file}
- ${input:updateReason:Reason for update}
- ${input:proposedChanges:Summary of proposed changes}

## Workflow

1. **Review Current Migration** - Understand existing script
2. **Identify Issues** - Determine what needs changing
3. **Update Migration** - Modify script safely
4. **Re-test** - Verify in development/staging
5. **Update Documentation** - Revise rollback and verification

## Important Considerations

- **Never modify applied migrations** - Create new migration instead
- **Test rollback** - Verify down migration still works
- **Check dependencies** - Ensure order is correct

## Output

Updated migration with:
- Fixed migration script
- Updated down migration
- Revised documentation
- Updated verification steps

## Quality Gate

The update is complete when:
- [ ] Migration tested in development
- [ ] Rollback verified
- [ ] Documentation updated
- [ ] Reviewed before deployment