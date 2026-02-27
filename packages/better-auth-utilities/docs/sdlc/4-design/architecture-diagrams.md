# Architecture Diagrams: Better Auth Utilities

## Overview

- **System Name**: Better Auth Utilities
- **Design Doc Reference**: [Technical Design Document](technical-design-doc.md)
- **Author**: Tech Lead
- **Last Updated**: 2026-01-03

---

## Context Diagram (Level 1)

Shows the system in context with external actors and systems.

```mermaid
C4Context
    title System Context Diagram - Better Auth Utilities

    Person(developer, "Effect-TS Developer", "TypeScript developer building auth features")
    
    System(bau, "Better Auth Utilities", "Effect-TS adapter library providing type-safe authentication utilities")
    
    System_Ext(betterAuth, "Better Auth SDK", "Authentication library with async/await API")
    System_Ext(database, "Database", "SQLite/PostgreSQL for user, session, account storage")
    System_Ext(oauthProviders, "OAuth Providers", "GitHub, Google, etc.")
    
    Rel(developer, bau, "Imports and uses", "TypeScript")
    Rel(bau, betterAuth, "Wraps API calls", "Effect.tryPromise")
    Rel(betterAuth, database, "Persists data", "SQL")
    Rel(betterAuth, oauthProviders, "OAuth flows", "HTTPS")
```

### Context Narrative

The Better Auth Utilities library sits between the developer's application and the Better Auth SDK. It transforms the SDK's async/await API into Effect-TS patterns with:
- Schema-validated inputs (Effect Schema)
- Tagged error types (InputError, ApiError, SessionError, DataMissingError, DependenciesError)
- Context/Layer dependency injection (AuthServerTag, BetterAuthOptionsTag)

---

## Container Diagram (Level 2)

Shows the major structural elements within the library.

```mermaid
C4Container
    title Container Diagram - Better Auth Utilities

    Person(developer, "Effect-TS Developer")
    
    Container_Boundary(bau, "Better Auth Utilities") {
        Container(schemas, "Schema Layer", "Effect Schema", "Command schemas, value objects (UrlSchema, NameSchema, etc.)")
        Container(controllers, "Controller Layer", "Effect", "Input validation, error mapping, orchestration")
        Container(services, "Service Layer", "Effect", "Better Auth API calls, response transformation")
        Container(layers, "Layer/Context", "Effect Context", "AuthServerTag, BetterAuthOptionsTag, AuthLive")
        Container(pipeline, "Pipeline Utilities", "Effect", "mapInputError, mapApiError, handlers")
        Container(errors, "Error Types", "Schema.TaggedError", "InputError, ApiError, SessionError, etc.")
    }
    
    System_Ext(betterAuth, "Better Auth SDK")
    System_Ext(database, "Database")
    
    Rel(developer, controllers, "Calls controllers", "Effect.Effect")
    Rel(controllers, schemas, "Validates with")
    Rel(controllers, services, "Delegates to")
    Rel(controllers, pipeline, "Maps errors with")
    Rel(controllers, errors, "Returns typed errors")
    Rel(services, layers, "Accesses context")
    Rel(services, pipeline, "Maps errors with")
    Rel(layers, betterAuth, "Constructs")
    Rel(betterAuth, database, "Persists")
```

### Container Details

| Container | Technology | Purpose |
|-----------|------------|---------|
| Schema Layer | Effect Schema | Input validation, type safety, value objects |
| Controller Layer | Effect | Public API, orchestration |
| Service Layer | Effect | Better Auth API integration |
| Layer/Context | Effect Context | Dependency injection |
| Pipeline Utilities | Effect | Error transformation |
| Error Types | Schema.TaggedError | Typed error contracts |

---

## Component Diagram (Level 3)

Shows components within the server operation layer.

```mermaid
C4Component
    title Component Diagram - Server Operations Layer

    Container_Boundary(serverOps, "Server Operations") {
        
        Component_Ext(email, "Email Domain", "11 operations - COMPLETE", "Reference implementation")
        
        Component(oauth, "OAuth Domain (E-001)", "3 operations", "US-001, US-002, US-003")
        Component(session, "Session Domain (E-002)", "7 operations", "US-004 through US-010")
        Component(account, "Account Domain (E-003)", "3 operations", "US-011, US-012, US-013")
        Component(user, "User Domain (E-004)", "3 operations", "US-014, US-015, US-016")
    }
    
    Container_Boundary(shared, "Shared Infrastructure") {
        Component(errors, "Error Types", "5 TaggedErrors", "InputError, ApiError, SessionError, DataMissingError, DependenciesError")
        Component(pipeline, "Pipeline Utils", "Error mappers", "mapInputError, mapApiError")
        Component(layers, "Layers", "DI", "AuthServerTag, AuthLive")
        Component(commands, "Command Schemas", "16+ schemas", "All operation inputs")
        Component(values, "Value Objects", "Schema wrappers", "UrlSchema, NameSchema, ImageSchema, PasswordSchema")
    }
    
    Rel(oauth, errors, "Throws")
    Rel(oauth, pipeline, "Uses")
    Rel(oauth, layers, "Requires")
    Rel(oauth, commands, "Validates with")
    
    Rel(session, errors, "Throws")
    Rel(session, pipeline, "Uses")
    Rel(session, layers, "Requires")
    
    Rel(account, errors, "Throws")
    Rel(account, pipeline, "Uses")
    Rel(account, layers, "Requires")
    
    Rel(user, errors, "Throws")
    Rel(user, pipeline, "Uses")
    Rel(user, layers, "Requires")
```

---

## Operation Component Diagram

Shows internal structure of a single operation (pattern for all 16).

```mermaid
flowchart TB
    subgraph operation["Operation: sign-in-social (US-001)"]
        controller["signInSocialServerController"]
        service["signInSocialServerService"]
        types["SignInSocialServerParams"]
        
        controller -->|validates with| types
        controller -->|delegates to| service
    end
    
    subgraph shared["Shared Components"]
        command["SignInSocialCommand"]
        mapInput["mapInputError"]
        mapApi["mapApiError"]
        authTag["AuthServerTag"]
        urlSchema["UrlSchema"]
    end
    
    types -->|contains| command
    command -->|uses| urlSchema
    controller -->|uses| mapInput
    service -->|uses| mapApi
    service -->|accesses| authTag
    
    subgraph external["External"]
        betterAuth["authServer.api.signInSocial"]
    end
    
    service -->|calls| betterAuth
```

---

## Data Flow Diagram

Shows the flow of data through an operation.

```mermaid
sequenceDiagram
    participant Consumer
    participant Controller
    participant Schema
    participant Service
    participant AuthTag
    participant BetterAuth
    
    Consumer->>Controller: unknownInput
    Controller->>Schema: decodeUnknown(ServerParams)
    
    alt Validation Fails
        Schema-->>Controller: ParseError
        Controller->>Controller: mapInputError
        Controller-->>Consumer: Effect.fail(InputError)
    else Validation Succeeds
        Schema-->>Controller: validatedParams
        Controller->>Service: call with params
        Service->>AuthTag: Effect.flatMap
        AuthTag-->>Service: authServer instance
        Service->>BetterAuth: api.operation(...)
        
        alt API Error
            BetterAuth-->>Service: throws Error
            Service->>Service: mapApiError
            Service-->>Controller: Effect.fail(ApiError)
            Controller-->>Consumer: Effect.fail(ApiError)
        else Success
            BetterAuth-->>Service: response data
            Service-->>Controller: Effect.succeed(data)
            Controller-->>Consumer: Effect.succeed(data)
        end
    end
```

---

## Error Hierarchy Diagram

```mermaid
classDiagram
    class TaggedError {
        <<Schema.TaggedError>>
        +_tag: string
        +message: string
    }
    
    class InputError {
        +_tag: "InputError"
        +message: string
        +cause?: unknown
    }
    
    class ApiError {
        +_tag: "ApiError"
        +message: string
        +status?: number
        +cause?: unknown
    }
    
    class SessionError {
        +_tag: "SessionError"
        +message: string
        +cause?: unknown
    }
    
    class DataMissingError {
        +_tag: "DataMissingError"
        +message: string
        +cause?: unknown
    }
    
    class DependenciesError {
        +_tag: "DependenciesError"
        +message: string
        +cause?: unknown
    }
    
    TaggedError <|-- InputError
    TaggedError <|-- ApiError
    TaggedError <|-- SessionError
    TaggedError <|-- DataMissingError
    TaggedError <|-- DependenciesError
```

---

## Layer Composition Diagram

```mermaid
flowchart TB
    subgraph consumer["Consumer Application"]
        program["Effect program"]
    end
    
    subgraph layers["Layer Stack"]
        authLive["AuthLive"]
        authServerLive["AuthServerLive"]
        optionsLive["BetterAuthOptionsLive"]
    end
    
    subgraph runtime["Runtime"]
        betterAuth["betterAuth(options)"]
    end
    
    program -->|"Effect.provide"| authLive
    authLive -->|"Layer.provide"| authServerLive
    authServerLive -->|"requires"| optionsLive
    authServerLive -->|"constructs"| betterAuth
    
    note1["AuthLive = Layer.provide(AuthServerLive, BetterAuthOptionsLive)"]
```

---

## File Structure Diagram

```
src/lib/
├── configs/                          # Configuration schemas
├── errors/                           # Tagged error types
│   ├── api.error.ts
│   ├── input.error.ts
│   ├── session.error.ts
│   ├── data-missing.error.ts
│   └── dependencies.error.ts
├── pipeline/                         # Error mapping utilities
│   ├── map-input-error/
│   ├── map-api-error/
│   ├── handle-input-error/
│   └── handle-api-error/
├── schema/
│   ├── commands/                     # Command schemas (16 pending)
│   ├── urls/                         # UrlSchema
│   ├── names/                        # NameSchema
│   ├── images/                       # ImageSchema
│   └── passwords/                    # PasswordSchema
└── server/
    ├── server.layer.ts               # AuthServerTag, AuthServerLive, AuthLive
    └── core/
        ├── email/                    # ✅ Complete (reference)
        ├── oauth/                    # ��� E-001: To Implement
        │   ├── sign-in-social/       # US-001
        │   ├── callback-oauth/       # US-002
        │   ├── link-social-account/  # US-003
        │   └── index.ts
        ├── session/                  # ��� E-002: To Implement
        │   ├── get-session/          # US-004
        │   ├── list-sessions/        # US-005
        │   ├── refresh-token/        # US-006
        │   ├── get-access-token/     # US-007
        │   ├── revoke-session/       # US-008
        │   ├── revoke-sessions/      # US-009
        │   ├── revoke-other-sessions/# US-010
        │   └── index.ts
        ├── account/                  # ��� E-003: To Implement
        │   ├── account-info/         # US-011
        │   ├── list-user-accounts/   # US-012
        │   ├── unlink-account/       # US-013
        │   └── index.ts
        └── user/                     # ��� E-004: To Implement
            ├── update-user/          # US-014
            ├── delete-user/          # US-015
            ├── delete-user-callback/ # US-016
            └── index.ts
```

---

## Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Complete/Implemented |
| ��� | To be implemented (Phase 1) |
| ⬜ | Future phase |
| `Schema.TaggedClass` | Effect Schema validated class |
| `Schema.TaggedError` | Effect Schema error with _tag |
| `Schema.instanceOf(Headers)` | Native Headers object validation |
| `Context.Tag` | Effect dependency injection tag |
| `Layer.effect` | Effect layer construction |

---

## Traceability

| Epic | Operations | User Stories |
|------|------------|--------------|
| E-001 | OAuth | US-001, US-002, US-003 |
| E-002 | Session | US-004, US-005, US-006, US-007, US-008, US-009, US-010 |
| E-003 | Account | US-011, US-012, US-013 |
| E-004 | User | US-014, US-015, US-016 |

---

## Notes

### Key Design Decisions Reflected

1. **Controller-Service Separation**: Each operation has distinct controller (validation) and service (API) components - see [ADR-001](adrs/adr-001-controller-service-architecture.md)
2. **Consistent Error Types**: Five tagged errors cover all failure modes
3. **Layer-Based DI**: AuthServerTag enables testable, composable architecture
4. **Domain Organization**: Operations grouped by auth domain (OAuth, Session, Account, User)
5. **Native Headers**: Uses `Schema.instanceOf(Headers)` for type-safe header passing

### Areas of Complexity

1. **OAuth Callback (US-002)**: Requires state validation and error handling
2. **Session Revocation (US-008, US-009, US-010)**: Multiple variants (single, all, others)
3. **Delete User (US-015)**: May require password confirmation

### Future Evolution

- Phase 2: Client-side operations will mirror server structure
- Phase 3: Session caching layer may add intermediary
- Phase 4: MFA operations will add new domain

---

## Change History

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-01-03 | 1.0 | Tech Lead | Initial architecture diagrams aligned with codebase |
