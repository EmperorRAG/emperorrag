---
description: 'Create a database migration script that safely applies schema changes'
mode: 'agent'
tools: ['search', 'codebase', 'usages', 'problems']
---

# Create Database Migration

You are a Backend Software Developer creating a database migration. Your goal is to create a safe, idempotent migration script that applies schema changes.

## Inputs Required

- ${input:migrationName:Name describing the migration}
- ${input:dataModelReference:Reference to updated data model}
- ${input:migrationTool:Migration tool (Prisma, TypeORM, Knex, etc.)}

## Workflow

1. **Review Schema Changes** - Understand required changes
2. **Write Migration** - Create migration script
3. **Test Migration** - Verify in development
4. **Plan Rollback** - Document rollback procedure
5. **Validate Data** - Check data integrity post-migration

## Output Structure

Generate a migration with:

### Migration Script

```typescript
// migrations/[timestamp]_[migration_name].ts

export async function up(db: DatabaseClient): Promise<void> {
  // Apply schema changes
  await db.schema.createTable('new_table', (table) => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.timestamp('created_at').defaultTo(db.fn.now());
  });

  // Add indexes
  await db.schema.alterTable('new_table', (table) => {
    table.index(['name'], 'idx_new_table_name');
  });
}

export async function down(db: DatabaseClient): Promise<void> {
  // Rollback changes
  await db.schema.dropTableIfExists('new_table');
}
```

### Migration Documentation

#### Purpose
- What this migration does
- Why it's needed

#### Changes Applied
- Tables created/modified/deleted
- Columns added/modified/removed
- Indexes added/removed
- Constraints changed

#### Data Migration (if applicable)
- Data transformations
- Default values for new columns

#### Pre-Migration Checklist
- [ ] Backup database
- [ ] Verify migration in staging
- [ ] Notify dependent services

#### Post-Migration Verification
- [ ] Schema matches expected state
- [ ] Data integrity verified
- [ ] Application functions correctly

#### Rollback Procedure
1. Run down migration
2. Verify rollback completed
3. [Additional steps if needed]

### Risk Assessment
- Potential data loss risks
- Lock duration expectations
- Recommended maintenance window

## Quality Gate

The migration is complete when:
- [ ] Migration is idempotent/safe
- [ ] Rollback plan documented
- [ ] Staging verification completed
- [ ] Reviewed by Backend Engineer