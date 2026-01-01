---
description: 'Template and guidelines for Data Model'
applyTo: '**/data-model/**/*.md, **/data-models/**/*.md, **/*-data-model.md'
---

# Data Model

A data model defines the structure, relationships, and constraints of data entities in the system.

## When to Use

- Designing new database schemas
- Documenting entity relationships
- Planning data migrations
- Establishing data contracts between services

## Template

```markdown
# Data Model: [Domain/Feature Name]

## Overview
- **Database**: [PostgreSQL | MongoDB | etc.]
- **Schema**: [Schema name]
- **Version**: [1.0]
- **Last Updated**: [Date]

---

## Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐
│      User       │       │     Account     │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │──┐    │ id (PK)         │
│ email           │  │    │ userId (FK)     │──┐
│ name            │  └───▶│ status          │  │
│ createdAt       │       │ createdAt       │  │
└─────────────────┘       └─────────────────┘  │
                                               │
                          ┌─────────────────┐  │
                          │   Transaction   │  │
                          ├─────────────────┤  │
                          │ id (PK)         │  │
                          │ accountId (FK)  │◀─┘
                          │ amount          │
                          │ createdAt       │
                          └─────────────────┘
```

---

## Entities

### [Entity Name]

**Description**: [What this entity represents]

**Table Name**: `[table_name]`

#### Fields

| Field | Type | Nullable | Default | Description |
|-------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| [field_name] | VARCHAR(255) | No | - | [Description] |
| [field_name] | INTEGER | Yes | 0 | [Description] |
| [field_name] | TIMESTAMP | No | NOW() | [Description] |
| createdAt | TIMESTAMP | No | NOW() | Creation timestamp |
| updatedAt | TIMESTAMP | No | NOW() | Last update timestamp |
| deletedAt | TIMESTAMP | Yes | NULL | Soft delete timestamp |

#### Indexes

| Index Name | Fields | Type | Purpose |
|------------|--------|------|---------|
| [idx_name] | [field1, field2] | BTREE | [Purpose] |
| [idx_name] | [field] | UNIQUE | [Purpose] |

#### Constraints

| Constraint | Type | Definition |
|------------|------|------------|
| [pk_name] | PRIMARY KEY | (id) |
| [fk_name] | FOREIGN KEY | (userId) REFERENCES users(id) |
| [ck_name] | CHECK | (status IN ('active', 'inactive')) |
| [uq_name] | UNIQUE | (email) |

---

### TypeScript Interface

```typescript
interface EntityName {
  id: string;
  fieldName: string;
  numericField: number;
  optionalField?: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

---

## Relationships

| Parent Entity | Child Entity | Type | FK Field | On Delete |
|---------------|--------------|------|----------|-----------|
| User | Account | 1:N | userId | CASCADE |
| Account | Transaction | 1:N | accountId | RESTRICT |
| User | Role | N:M | (via user_roles) | CASCADE |

---

## Enumerations

### [EnumName]

| Value | Description |
|-------|-------------|
| active | [Description] |
| inactive | [Description] |
| pending | [Description] |

**SQL Definition**:
```sql
CREATE TYPE status_enum AS ENUM ('active', 'inactive', 'pending');
```

---

## Migration Scripts

### Create Table

```sql
CREATE TABLE [table_name] (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    field_name VARCHAR(255) NOT NULL,
    numeric_field INTEGER DEFAULT 0,
    status status_enum NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_table_field ON [table_name](field_name);
CREATE INDEX idx_table_status ON [table_name](status) WHERE deleted_at IS NULL;
```

### Add Column

```sql
ALTER TABLE [table_name]
ADD COLUMN new_field VARCHAR(100);
```

---

## Seed Data

```sql
INSERT INTO [table_name] (field_name, status)
VALUES
    ('value1', 'active'),
    ('value2', 'pending');
```

---

## Data Validation Rules

| Field | Validation | Error Message |
|-------|------------|---------------|
| email | Valid email format | Invalid email format |
| name | Length 1-255 | Name must be 1-255 characters |

---

## Performance Considerations

- [Index strategy for common queries]
- [Partitioning strategy if applicable]
- [Archival policy for historical data]

---

## References

- [Link to Technical Design Doc]
- [Link to API Contract]
```

## Quality Criteria

- [ ] All entities documented with field definitions
- [ ] Relationships clearly mapped
- [ ] Indexes defined for query patterns
- [ ] Constraints specified
- [ ] TypeScript interfaces included
- [ ] Migration scripts provided
