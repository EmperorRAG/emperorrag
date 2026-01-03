# Product Roadmap: Better Auth Utilities

**Document Version**: 1.0
**Last Updated**: January 3, 2026
**Owner**: Product Manager
**Vision Reference**: [Product Vision](./product-vision.md)

---

## Roadmap Overview

**Time Horizon**: 6 months (Q1-Q2 2026)
**Planning Cadence**: Quarterly review with monthly checkpoints

This roadmap translates the product vision into actionable initiatives organized by strategic themes. Work is organized into Now (current quarter), Next (following quarter), and Later (future consideration) horizons.

---

## Themes & Outcomes by Time Period

### NOW (Q1 2026) - Foundation & Core Operations

**Strategic Alignment**: Type-Safe Error Handling, Schema-Validated Inputs, Comprehensive Coverage

#### Theme 1: Error System Foundation

**Target Outcome**: Unified tagged error hierarchy for all operations

| Initiative | Description | Success Metric |
|------------|-------------|----------------|
| Error Type Hierarchy | Define `InputError`, `SessionError`, `ApiError`, `DependencyError` with Schema | All errors extend `Data.TaggedError` |
| Error Mapping Pipeline | Create `mapApiError`, `handleApiError` pipeline stages | 100% API errors mapped to typed errors |
| Error Documentation | Document error codes and recovery patterns | README section complete |

**Dependencies**: None
**Risks**: Breaking changes to existing error consumers

#### Theme 2: Client Command Schemas

**Target Outcome**: Schema-validated commands for all client operations

| Initiative | Description | Success Metric |
|------------|-------------|----------------|
| Authentication Commands | `SignInEmail`, `SignUpEmail`, `SignOut` schemas | Full validation coverage |
| Session Commands | `GetSession`, `ListSessions`, `RevokeSession` schemas | Full validation coverage |
| Password Commands | `ChangePassword`, `ResetPassword`, `ForgetPassword` schemas | Full validation coverage |
| Account Commands | `UpdateUser`, `DeleteUser`, `LinkAccount` schemas | Full validation coverage |

**Dependencies**: Error System Foundation
**Risks**: Schema design may need iteration based on usage

#### Theme 3: Client Pipeline Implementation

**Target Outcome**: Effect-based client operations with full type safety

| Initiative | Description | Success Metric |
|------------|-------------|----------------|
| Pipeline Stage Types | Define `PipelineContext`, stage type signatures | TypeScript compiles with strict |
| Validation Stages | Input validation pipeline stages | All commands validate before API call |
| API Call Stages | Effect-wrapped API operations | All operations return `Effect<Result, Error>` |
| Response Mapping | Type-safe response transformation | Response types match Schema definitions |

**Dependencies**: Client Command Schemas
**Risks**: Performance overhead needs benchmarking

---

### NEXT (Q2 2026) - Server Integration & Advanced Features

**Strategic Alignment**: Layered Architecture, Pipeline Composition

#### Theme 4: Server Layer Architecture

**Target Outcome**: Injectable AuthServer service via Effect Layer

| Initiative | Description | Success Metric |
|------------|-------------|----------------|
| AuthServer Context | Define `AuthServerFor` Context tag | Compiles with `R` requirement |
| AuthServer Layer | Create `AuthServerLive` Layer factory | Layer provides server instance |
| Server Operations | Effect-wrapped server-side operations | Full parity with client operations |
| Policy Extraction | Extract password/session policies from config | Policies available at runtime |

**Dependencies**: Client Pipeline Implementation
**Risks**: Server-side testing requires more complex setup

#### Theme 5: Test Infrastructure

**Target Outcome**: Complete test harness for Effect-based auth testing

| Initiative | Description | Success Metric |
|------------|-------------|----------------|
| Effect Test Harness | `run`, `runExit`, `testEffect` helpers | Vitest integration working |
| Mock Layers | `AuthServerMock`, `AuthClientMock` layers | Tests run without real server |
| Server Test Environment | In-memory SQLite test setup | E2E tests pass |
| Example Test Suite | Document testing patterns | Examples in README |

**Dependencies**: Server Layer Architecture
**Risks**: Test isolation across async boundaries

#### Theme 6: OAuth & Social Authentication

**Target Outcome**: Type-safe social provider integration

| Initiative | Description | Success Metric |
|------------|-------------|----------------|
| OAuth Command Schemas | `SignInSocial`, `CallbackOAuth`, `LinkSocialAccount` | Full validation coverage |
| Provider Type Safety | Typed provider identifiers | Compile-time provider validation |
| OAuth Pipeline | Effect-based OAuth flow | Full flow tests pass |

**Dependencies**: Server Layer Architecture
**Risks**: Provider-specific edge cases

---

### LATER (H2 2026) - Enterprise Features & Publishing

**Strategic Alignment**: Comprehensive Coverage, Ecosystem Growth

#### Theme 7: Advanced Authentication

**Target Outcome**: Multi-factor and admin operations

| Initiative | Description | Success Metric |
|------------|-------------|----------------|
| Two-Factor Commands | `EnableTwoFactor`, `VerifyTwoFactor` schemas | Full 2FA flow working |
| Admin Operations | Admin user management commands | Admin operations typed |
| API Key Management | API key creation and validation | API key flows working |

**Dependencies**: OAuth & Social Authentication
**Risks**: Plugin compatibility matrix

#### Theme 8: NPM Publishing & Documentation

**Target Outcome**: Published package with comprehensive docs

| Initiative | Description | Success Metric |
|------------|-------------|----------------|
| Package Preparation | Finalize `package.json`, exports, bundling | Clean npm publish |
| API Documentation | TSDoc + generated API docs | Docs site deployed |
| Migration Guide | Document upgrade paths | Guide covers all versions |
| Example Projects | Reference implementations | Examples repo published |

**Dependencies**: All previous themes
**Risks**: Documentation maintenance burden

---

## Milestones

| Milestone | Target Date | Deliverables | Gate Criteria |
|-----------|-------------|--------------|---------------|
| M1: Error Foundation | Jan 31, 2026 | Tagged errors, error mapping pipeline | All error types defined, tests pass |
| M2: Client Commands | Feb 28, 2026 | All client command schemas | 100% client operations covered |
| M3: Client Pipeline | Mar 31, 2026 | Full client pipeline implementation | Integration tests pass |
| M4: Server Layer | Apr 30, 2026 | AuthServer Layer, server operations | Server tests pass |
| M5: Test Infrastructure | May 31, 2026 | Complete test harness | >90% coverage achieved |
| M6: OAuth Support | Jun 30, 2026 | Social auth commands and pipeline | OAuth flow tests pass |

---

## Dependencies

### Technical Dependencies

| Dependency | Type | Owner | Status |
|------------|------|-------|--------|
| `effect` ^3.0.0 | External | Effect-TS team | Stable |
| `better-auth` ^1.0.0 | External | Better Auth team | Stable |
| `@effect/schema` | External | Effect-TS team | Stable |
| `packages/utilities` | Internal | Emperorrag | Available |

### Cross-Team Dependencies

| Dependency | Team | Impact | Coordination |
|------------|------|--------|--------------|
| NestJS Microservice | Backend | Consumes library | Feedback loop |
| Next.js Frontend | Frontend | Future consumer | Interface alignment |

---

## Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Effect-TS major version | Low | High | Pin version, test upgrade path quarterly |
| Better Auth plugin changes | Medium | Medium | Document supported plugin versions |
| Scope expansion to frameworks | High | Medium | Strict NOW/NEXT/LATER boundaries |
| Test complexity | Medium | Low | Invest in test infrastructure early (Theme 5) |
| Documentation lag | Medium | Medium | Docs as part of DoD for each initiative |

---

## Quality Gate Checklist

- [x] Roadmap reviewed and accepted by stakeholders
- [x] Dependencies and milestones visible
- [x] Themes aligned with strategic pillars from vision
- [x] Prioritization rationale documented (NOW = foundation, NEXT = integration, LATER = enterprise)
- [x] Success metrics defined per initiative
- [x] Risks identified with mitigation strategies

---

## Current State Assessment

Based on codebase analysis, the following work is **already complete**:

| Area | Status | Files |
|------|--------|-------|
| Error Types | ✅ Complete | `errors/*.error.ts` (5 types) |
| Config Schema | ✅ Complete | `configs/config.schema.ts` |
| Config Layer | ✅ Complete | `configs/config.layer.ts` |
| Client Commands | ✅ Complete | `schema/commands/**/*.command.ts` (28 commands) |
| Pipeline Stages | ✅ Complete | `pipeline/**/*.ts` (8 stages) |
| Server Layer | ✅ Complete | `server/server.layer.ts` |
| Server Test Setup | ✅ Complete | `server/test/setupServerTestEnvironment.ts` |
| Effect Test Harness | ✅ Complete | `test/effectTestHarness.ts` |
| Policy Extraction | ✅ Complete | `policy/extract/extractPolicy.ts` |

**Roadmap Impact**: Most Q1 work is complete. Q2 themes (server integration, OAuth) should be the immediate focus.

---

*Previous: [Product Vision](./product-vision.md)*
*Next Stage: [Definition](../2-definition/prd.md)*
