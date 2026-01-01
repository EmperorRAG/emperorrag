---
description: 'Template and guidelines for Database Migration'
applyTo: '**/db-migration/**/*.md, **/migrations/**/*.md, **/*-db-migration.md'
---

# Database Migration

A database migration documents schema changes with reversible scripts and rollback procedures.

## When to Use

- Adding new tables or columns
- Modifying existing schema
- Data transformations
- Index or constraint changes

## Template

```markdown
# Database Migration: [Migration Name]

## Migration Info
- **Version**: [YYYYMMDDHHMMSS]
- **Author**: [Name]
- **Status**: [Pending | Applied | Rolled Back]
- **Date Created**: [YYYY-MM-DD]

---

## Summary

[Brief description of what this migration does]

---

## Changes

### Schema Changes

| Table | Change Type | Description |
|-------|-------------|-------------|
| [table_name] | CREATE | New table for [purpose] |
| [table_name] | ALTER | Add column [column_name] |
| [table_name] | DROP | Remove deprecated [item] |

### Index Changes

| Index | Table | Type | Purpose |
|-------|-------|------|---------|
| idx_name | table | BTREE | Improve query performance |

### Constraint Changes

| Constraint | Type | Description |
|------------|------|-------------|
| fk_name | FOREIGN KEY | Relationship to [table] |

---

## Migration Script (Up)

```sql
-- Migration: [version]_[name]
-- Description: [What this does]

BEGIN;

-- Create new table
CREATE TABLE IF NOT EXISTS new_table (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Add new column to existing table
ALTER TABLE existing_table
ADD COLUMN new_column VARCHAR(100);

-- Add index
CREATE INDEX CONCURRENTLY idx_new_table_name 
ON new_table(name);

-- Add foreign key
ALTER TABLE child_table
ADD CONSTRAINT fk_child_parent
FOREIGN KEY (parent_id) REFERENCES parent_table(id)
ON DELETE CASCADE;

-- Data migration (if needed)
UPDATE existing_table
SET new_column = 'default_value'
WHERE new_column IS NULL;

-- Set NOT NULL after data migration
ALTER TABLE existing_table
ALTER COLUMN new_column SET NOT NULL;

COMMIT;
```

---

## Rollback Script (Down)

```sql
-- Rollback: [version]_[name]
-- Description: Revert [migration name]

BEGIN;

-- Remove constraint
ALTER TABLE child_table
DROP CONSTRAINT IF EXISTS fk_child_parent;

-- Remove index
DROP INDEX CONCURRENTLY IF EXISTS idx_new_table_name;

-- Remove column
ALTER TABLE existing_table
DROP COLUMN IF EXISTS new_column;

-- Drop table
DROP TABLE IF EXISTS new_table;

COMMIT;
```

---

## Prisma Migration

```prisma
// schema.prisma changes

model NewTable {
  id        String   @id @default(uuid())
  name      String
  status    Status   @default(PENDING)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("new_table")
}

enum Status {
  PENDING
  ACTIVE
  INACTIVE
}
```

---

## Pre-Migration Checklist

- [ ] Backup database before migration
- [ ] Test migration on staging environment
- [ ] Verify rollback script works
- [ ] Review impact on running applications
- [ ] Coordinate maintenance window if needed
- [ ] Notify affected teams

---

## Post-Migration Verification

| Check | Query/Action | Expected Result |
|-------|--------------|-----------------|
| Table exists | `\d new_table` | Table structure visible |
| Data migrated | `SELECT COUNT(*) FROM table` | [Expected count] |
| Index created | `\di idx_name` | Index visible |
| FK works | Insert child without parent | Should fail |

---

## Rollback Procedure

1. Stop dependent services
2. Run rollback script
3. Verify schema reverted
4. Restart services
5. Verify application functionality

---

## Impact Assessment

### Applications Affected
- [Application/Service 1]
- [Application/Service 2]

### Downtime Required
- [ ] No downtime (online migration)
- [ ] Brief downtime (< 5 minutes)
- [ ] Maintenance window required

### Performance Impact
[Expected impact during migration]

---

## References

- [Link to Technical Design]
- [Link to Data Model]
- [Link to related migrations]
```

## Quality Criteria

- [ ] Up migration script provided
- [ ] Down migration script provided
- [ ] Scripts are idempotent where possible
- [ ] Rollback procedure documented
- [ ] Impact assessment completed
- [ ] Pre/post verification steps defined
