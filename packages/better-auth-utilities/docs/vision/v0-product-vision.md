# Product Vision: Better Auth Utilities

## Overview

- **Product**: Better Auth Utilities
- **Owner**: Product Manager
- **Last Updated**: 2026-01-03
- **Status**: Approved

---

## Vision Statement

> Empower TypeScript developers using Effect-TS to integrate Better Auth with type-safe patterns, Schema-validated inputs, tagged errors, and dependency injection—eliminating boilerplate and enabling true functional composition in authentication workflows.

---

## Problem Space

### The Problem We're Solving

Better Auth SDK uses traditional async/await patterns with thrown exceptions, making it incompatible with Effect-TS's typed error channels, composable pipelines, and dependency injection patterns. Developers must write custom wrappers to bridge these paradigms.

### Who Experiences This Problem

| Segment | Description | Pain Level |
|---------|-------------|------------|
| Effect-TS Developers | TypeScript developers using Effect for type-safe FP | High |
| NestJS Engineers | Backend developers in Emperorrag ecosystem needing auth utilities | Medium |
| Full-stack Teams | Teams adopting Effect-TS needing auth integration | Medium |

### Current Alternatives

| Alternative | Strengths | Weaknesses |
|-------------|-----------|------------|
| Raw Better Auth SDK | Official, full-featured, documented | No Effect integration, thrown exceptions, no schema validation |
| Custom wrappers | Tailored to project needs | Duplicated effort, untested, inconsistent patterns |
| Do nothing | No effort | Imperative code mixed with Effect, poor error handling, testing friction |

### Why Now?

- Effect-TS adoption is accelerating in the TypeScript ecosystem
- Better Auth has become a popular authentication solution
- The Emperorrag monorepo needs standardized auth utilities
- Functional programming patterns require proper library support

---

## Target Users

### Primary Persona

| Attribute | Details |
|-----------|----------|
| **Name** | Effect-TS Developer |
| **Role** | Full-stack or backend TypeScript developer |
| **Goals** | Build type-safe applications with composable authentication |
| **Pain Points** | No Effect-compatible auth library, writing boilerplate wrappers, untyped errors |
| **Current Behavior** | Writing custom Effect wrappers around Better Auth or mixing paradigms |

### Secondary Personas

| Persona | Role | Key Needs |
|---------|------|------------|
| NestJS Backend Engineer | Backend developer in Emperorrag ecosystem | Reliable auth primitives, clear error contracts |
| Monorepo Consumer | Developer using shared packages | Documented, tested utilities with stable API |

---

## Strategic Pillars

### 1. Type-Safe Error Handling

Provide a comprehensive tagged error hierarchy (input errors, API errors, session errors, missing-data errors, dependency errors) that enables exhaustive pattern matching and typed recovery strategies.

**Key Capabilities:**

- All errors use Effect's tagged-error pattern for runtime and compile-time safety
- Errors carry structured metadata (status codes, causes, messages)
- Pipeline utilities for mapping and handling errors across transformation stages

### 2. Schema-Validated Inputs

Every authentication operation accepts inputs validated through Effect Schema, providing both compile-time type checking and runtime validation.

**Key Capabilities:**

- Command schemas for each operation (sign-up, sign-in, reset password, etc.)
- Reusable field schemas (emails, passwords, names, URLs, sessions)
- Tagged parameter classes with built-in decode and encode capabilities

### 3. Dependency Injection via Context/Layer

Authentication server instances and configuration are provided through Effect's Context and Layer system, enabling composable, testable architecture.

**Key Capabilities:**

- Effect tag and live layer for configuration
- Effect tag and live layer for the server instance
- Composable layer stack that provides the full auth environment from configuration through server

### 4. Controller-Service Architecture

Each authentication operation follows a consistent controller-service pattern with clear separation of concerns.

**Key Capabilities:**

- Controllers handle input validation and error mapping
- Services execute operations against the auth server via Effect Context
- Consolidated module exports for a clean, discoverable API

### 5. Comprehensive Coverage

Support all core Better Auth operations across email, OAuth, session, account, and user management domains.

**Key Capabilities:**

- Email operations: sign-up, sign-in, sign-out, verify, password reset/change
- OAuth operations: sign-in, callback, link/unlink social accounts
- Session operations: get, list, refresh, revoke
- User operations: update, delete
- Account operations: list, unlink

---

## Value Proposition

### For Effect-TS Developers

- **Who** need to integrate Better Auth into Effect-TS applications
- **Our product** is a functional programming adapter layer
- **That** provides type-safe, composable authentication utilities
- **Unlike** using Better Auth directly or writing custom wrappers
- **We** deliver schema validation, tagged errors, and Layer-based DI out of the box

### Key Benefits

| Benefit | How We Deliver It |
|---------|-------------------|
| Type-safe error handling | Tagged errors using Effect's error schema for exhaustive matching |
| Input validation | Effect Schema with compile-time + runtime checks |
| Composable operations | Effect pipelines with composable operators for chaining, branching, and recovery |
| Testable architecture | Context/Layer DI for easy mocking and isolation |
| Reduced boilerplate | Pre-built controller/service for common auth operations |

---

## Success Metrics

### North Star Metric

| Metric | Definition | Current | Target (12mo) |
|--------|------------|---------|---------------|
| Adoption Rate | Projects in monorepo using the library | 0 | ≥3 |

### Supporting Metrics

| Category | Metric | Target |
|----------|--------|--------|
| Quality | Type Safety Coverage (no escape-hatch types) | 100% |
| Quality | Schema Coverage (inputs validated) | 100% |
| Quality | Error Coverage (tagged errors) | 100% |
| Quality | Test Coverage (line coverage) | ≥80% |
| Documentation | TSDoc coverage | 100% |
| Adoption | Monorepo projects consuming | ≥2 |

---

## What We Will NOT Do

| Out of Scope | Rationale |
|--------------|-----------|
| Custom authentication strategies | We wrap Better Auth's existing strategies, not create new ones |
| Database adapters | Database configuration is passed through to Better Auth |
| UI components | This is a backend/SDK library; no React/frontend components |
| Multi-tenancy logic | Tenant management is application-level concern |
| Rate limiting / abuse protection | Security policies are configured in Better Auth directly |

---

## Key Differentiators

| Aspect | Better Auth SDK | Better Auth Utilities |
|--------|-----------------|----------------------|
| Error Handling | Thrown exceptions | Tagged Effect errors |
| Input Validation | None (runtime) | Schema at compile + runtime |
| Dependency Injection | Imperative config | Context/Layer composition |
| Composability | Async/await | Effect pipelines |
| Type Safety | Partial | Full (strict mode) |
| Testability | Requires mocking | Layer-based DI |

---

## Technology Stack

- **Language**: TypeScript 5.x (strict mode)
- **Core Library**: Effect-TS (core and schema packages)
- **Auth SDK**: Better Auth
- **Build**: Vite (library mode via Nx integration)
- **Testing**: Vitest with Effect-TS testing extensions
- **Monorepo**: Nx

---

## Time Horizons

### Now (0-6 months)

- Complete SDLC documentation suite
- Implement all server domains (Email, OAuth, Session, Account, User)
- Achieve ≥80% test coverage

### Next (6-12 months)

- Implement client-side utilities to match server parity
- Add integration test suite
- Property-based testing

### Later (12+ months)

- Multi-factor authentication support
- Expanded OAuth provider utilities
- npm package publication

---

## Assumptions & Risks

### Key Assumptions

| Assumption | How We'll Validate |
|------------|-----------------------|
| Effect-TS patterns are suitable for auth workflows | Prototype core operations, gather developer feedback |
| Better Auth API is stable enough to wrap | Monitor release notes, maintain version pinning |
| Schema validation overhead is acceptable | Benchmark validation performance |

### Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Better Auth SDK breaking changes | Medium | High | Pin version, monitor releases, test matrix |
| Effect-TS major version changes | Low | High | Follow Effect-TS release notes |
| Test coverage gaps hide bugs | Medium | Medium | Enforce coverage thresholds in CI |
| Documentation drift from code | Medium | Low | Automate doc generation, review PRs |

---

## Related Documentation

- [Product Roadmap](../roadmap/v0-product-roadmap.md)

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Product Manager | | 2026-01-03 | ✅ Approved |
| Tech Lead | | 2026-01-03 | ✅ Approved |
| Backend Engineer | | 2026-01-03 | ✅ Approved |
