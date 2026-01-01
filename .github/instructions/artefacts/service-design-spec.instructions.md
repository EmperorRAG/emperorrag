---
description: 'Template and guidelines for Service Design Specification'
applyTo: '**/service-design-spec/**/*.md, **/*-service-design-spec.md'
---

# Service Design Specification

A service design specification details the internal architecture of a service, including module structure, components, dependency injection, configuration, and testing approach.

## When to Use

- Designing a new service or microservice
- Documenting internal service architecture
- Guiding implementation of service modules
- Onboarding developers to a service

## Template

```markdown
# Service Design Specification: [Service Name]

## Overview

- **Service Name**: [Name]
- **Technical Design Reference**: [Link]
- **Owner**: [Team/Individual]
- **Last Updated**: [Date]
- **Status**: [Draft / In Review / Approved]

### Purpose
[Brief description of what the service does and its role in the system]

### Scope
[What is and isn't covered by this service]

---

## Module Structure

### Directory Layout

```
src/
├── app/
│   ├── [module-1]/
│   │   ├── [module-1].module.ts
│   │   ├── [module-1].controller.ts
│   │   ├── [module-1].service.ts
│   │   ├── dto/
│   │   ├── entities/
│   │   └── __tests__/
│   ├── [module-2]/
│   │   └── ...
│   └── common/
│       ├── filters/
│       ├── guards/
│       ├── interceptors/
│       └── pipes/
├── config/
├── shared/
└── main.ts
```

### Module Descriptions

| Module | Purpose | Dependencies |
|--------|---------|--------------|
| [Module 1] | [Purpose] | [Other modules] |
| [Module 2] | [Purpose] | [Other modules] |
| Common | Shared utilities, guards, filters | None |

---

## Core Components

### [Module 1 Name]

#### Controller: `[Module1]Controller`

**Purpose**: [What HTTP endpoints it handles]

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/[path]` | GET | [Description] | [Required/Optional] |
| `/[path]` | POST | [Description] | [Required/Optional] |
| `/[path]/:id` | PUT | [Description] | [Required/Optional] |

#### Service: `[Module1]Service`

**Purpose**: [Business logic it implements]

**Key Methods**:

| Method | Purpose | Returns |
|--------|---------|---------|
| `findAll()` | [Description] | `Promise<Entity[]>` |
| `findOne(id)` | [Description] | `Promise<Entity>` |
| `create(dto)` | [Description] | `Promise<Entity>` |

#### Repository: `[Module1]Repository`

**Purpose**: [Data access patterns]

**Data Source**: [Database/External API/Cache]

#### DTOs

| DTO | Purpose | Validation |
|-----|---------|------------|
| `Create[Entity]Dto` | Create input | [Key validations] |
| `Update[Entity]Dto` | Update input | [Key validations] |
| `[Entity]ResponseDto` | API response | N/A |

---

### [Module 2 Name]

[Repeat structure for each module]

---

## Dependency Injection

### Provider Registration

```typescript
// Example module configuration
@Module({
  imports: [
    DatabaseModule,
    CacheModule,
    ExternalServiceModule,
  ],
  controllers: [Module1Controller],
  providers: [
    Module1Service,
    {
      provide: 'REPOSITORY',
      useClass: Module1Repository,
    },
    {
      provide: 'CONFIG',
      useFactory: (configService: ConfigService) => ({
        // configuration
      }),
      inject: [ConfigService],
    },
  ],
  exports: [Module1Service],
})
export class Module1Module {}
```

### Custom Providers

| Token | Type | Purpose |
|-------|------|---------|
| `DATABASE_CONNECTION` | useFactory | Database connection |
| `CACHE_MANAGER` | useClass | Caching layer |
| `EXTERNAL_CLIENT` | useFactory | External API client |

### Injection Patterns

- Use constructor injection for required dependencies
- Use `@Optional()` for optional dependencies
- Use `@Inject()` with tokens for non-class providers

---

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | 3000 | Server port |
| `DATABASE_URL` | Yes | - | Database connection string |
| `LOG_LEVEL` | No | info | Logging level |
| `CACHE_TTL` | No | 300 | Cache TTL in seconds |

### Configuration Schema

```typescript
export const configSchema = {
  port: Joi.number().default(3000),
  database: {
    url: Joi.string().required(),
    poolSize: Joi.number().default(10),
  },
  cache: {
    ttl: Joi.number().default(300),
    host: Joi.string().default('localhost'),
  },
};
```

### Configuration Modules

| Module | Namespace | Source |
|--------|-----------|--------|
| DatabaseConfig | `database` | Environment + defaults |
| CacheConfig | `cache` | Environment + defaults |
| FeatureFlags | `features` | Config service |

---

## Error Handling

### Exception Filters

| Filter | Catches | Response Format |
|--------|---------|-----------------|
| `HttpExceptionFilter` | All HTTP exceptions | Standard error response |
| `ValidationExceptionFilter` | Validation errors | Detailed validation errors |
| `DatabaseExceptionFilter` | Database errors | Generic error (no details) |

### Error Response Format

```typescript
{
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
  details?: Record<string, any>;
}
```

### Error Codes

| Code | HTTP Status | Meaning |
|------|-------------|---------|
| `ENTITY_NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Input validation failed |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Permission denied |

---

## Middleware & Interceptors

### Request Pipeline

```
Request → Middleware → Guards → Interceptors (pre) → Pipes → Handler → Interceptors (post) → Response
```

### Middleware

| Middleware | Purpose | Applied To |
|------------|---------|------------|
| `LoggerMiddleware` | Request logging | All routes |
| `CorrelationIdMiddleware` | Trace ID injection | All routes |

### Interceptors

| Interceptor | Purpose |
|-------------|---------|
| `TransformInterceptor` | Response transformation |
| `TimeoutInterceptor` | Request timeout handling |
| `CacheInterceptor` | Response caching |

### Guards

| Guard | Purpose | Applied To |
|-------|---------|------------|
| `AuthGuard` | Authentication | Protected routes |
| `RolesGuard` | Authorization | Role-restricted routes |

---

## Testing Strategy

### Unit Tests

**Location**: `src/app/[module]/__tests__/*.spec.ts`

**Coverage Target**: 80%

```typescript
describe('Module1Service', () => {
  let service: Module1Service;
  let repository: jest.Mocked<Module1Repository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        Module1Service,
        {
          provide: 'REPOSITORY',
          useValue: createMock<Module1Repository>(),
        },
      ],
    }).compile();

    service = module.get(Module1Service);
    repository = module.get('REPOSITORY');
  });

  // Tests...
});
```

### Integration Tests

**Location**: `test/[module].e2e-spec.ts`

**Scope**: API endpoints with test database

### Mocking Strategy

| Dependency | Mock Approach |
|------------|---------------|
| Repository | Jest mock |
| External APIs | nock/WireMock |
| Database | Test database or in-memory |
| Cache | In-memory mock |

---

## Performance Considerations

### Caching Strategy

| Data | Cache Location | TTL | Invalidation |
|------|----------------|-----|--------------|
| [Data 1] | Redis | 5 min | On update |
| [Data 2] | In-memory | 1 min | Time-based |

### Connection Pooling

| Resource | Pool Size | Timeout |
|----------|-----------|---------|
| Database | 10 | 30s |
| Redis | 5 | 10s |

### Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/*` | 100 | 1 minute |
| `/auth/*` | 10 | 1 minute |

---

## Related Documentation

- [Technical Design Document](link)
- [API Contract](link)
- [Database Schema](link)
- [Monitoring Spec](link)
```

## Quality Criteria

- [ ] All modules documented with purpose and dependencies
- [ ] DI configuration clearly explained
- [ ] Configuration schema defined
- [ ] Error handling approach documented
- [ ] Testing strategy with examples
- [ ] Reviewed by tech lead and team
