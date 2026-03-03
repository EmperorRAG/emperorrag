# Product Roadmap: Better Auth Utilities

## Overview

- **Product**: Better Auth Utilities
- **Vision Reference**: [Product Vision](../vision/v1-product-vision.md)
- **Last Updated**: 2026-03-03
- **Roadmap Period**: 2026

---

## Strategic Context

### Vision Alignment

Better Auth Utilities is being developed as a reusable authentication utility library for Effect-based TypeScript systems. It originates from real internal implementation needs, but is being shaped so that it can be documented, packaged, and used beyond its original monorepo context.

### Annual Theme

> Mature Better Auth Utilities into a publishable, Effect-aligned authentication library validated through real usage.

### Strategic Priorities

1. Establish stable core server-side authentication capabilities across the main Better Auth domains
2. Improve maintainability through consistent public API structure, documentation, and testing
3. Validate the library in real consuming projects and prepare it for external use
4. Expand capability coverage selectively based on practical usefulness and sustainable maintenance

---

## Roadmap Overview

### Now

Focus on documentation alignment, server-side maturity, and stable library patterns.

### Next

Focus on release readiness, consumer validation, and improving external usability.

### Later

Focus on publication, feedback-driven expansion, and selective adjacent capabilities.

---

## Now (Q1-Q2 2026)

### Theme: Foundation and Server-Side Maturity

Bring the product documentation, core server-side capabilities, and internal library structure into a coherent and maintainable baseline.

| Initiative | Description | Priority | Outcome |
|------------|-------------|----------|---------|
| I-001: Documentation Alignment | Align SDLC artefacts to the true product shape and architecture | P0 | Documentation reflects the real product and supports future change |
| I-002: Core Server Capability Coverage | Complete the most important server-side capabilities across email, OAuth, session, account, and user domains | P0 | Core server capability surface is available |
| I-003: Public API Shape Stabilization | Establish consistent operational structure and stable export surfaces across implemented domains | P0 | Consumers can rely on a coherent library interface |
| I-004: Documentation Readiness Baseline | Ensure release-scope public APIs and core workflows are documented clearly | P1 | Library is understandable to future consumers |
| I-005: Automated Quality Baseline | Establish reliable automated testing for implemented capabilities | P1 | Implemented capabilities have repeatable quality checks |

### Key Milestones

| Milestone | Target Window | Status |
|-----------|---------------|--------|
| M-001: Product Documentation Aligned | Q1 2026 | ⬜ Planned |
| M-002: Core Server Domains Available | Q1-Q2 2026 | ⬜ Planned |
| M-003: Stable Initial Public API Baseline | Q2 2026 | ⬜ Planned |
| M-004: Release-Quality Documentation and Test Baseline | Q2 2026 | ⬜ Planned |

---

## Next (Q2-Q3 2026)

### Theme: Release Readiness and Consumer Validation

Validate that the library can be used reliably in real projects and prepare it for external consumption.

| Initiative | Description | Priority | Outcome |
|------------|-------------|----------|---------|
| I-006: Internal Consumer Validation | Validate the library in at least one real consuming project | P0 | Product proves useful outside isolated implementation work |
| I-007: External Installation and Packaging Validation | Prove the package can be installed and consumed outside the original monorepo context | P0 | External consumption path is viable |
| I-008: Integration Confidence | Add integration-level validation for critical capability flows | P1 | Core workflows are validated more realistically |
| I-009: Consumer Documentation | Produce getting-started, usage, and migration guidance for intended consumers | P1 | Onboarding is practical for new users |
| I-010: Selective Client-Side Support Evaluation | Evaluate and implement client-side utilities only where they materially improve product usefulness | P2 | Client support grows based on justified need rather than parity for its own sake |

### Key Milestones

| Milestone | Target Window | Status |
|-----------|---------------|--------|
| M-005: First Consumer Project Validated | Q2-Q3 2026 | ⬜ Planned |
| M-006: External Install Path Proven | Q3 2026 | ⬜ Planned |
| M-007: Release Candidate Readiness | Q3 2026 | ⬜ Planned |

---

## Later (Q3-Q4 2026)

### Theme: Publication and Feedback-Driven Expansion

Publish the library for external use and expand it in areas justified by real usage, product coherence, and maintenance capacity.

| Initiative | Description | Confidence | Rationale |
|------------|-------------|------------|-----------|
| I-011: npm Package Publication | Publish the library for external consumption | High | Core step toward public usability |
| I-012: Migration and Adoption Guidance | Provide clearer guidance for consumers adopting from raw Better Auth or local wrappers | Medium | Improves external usability |
| I-013: Additional Authentication Capability Expansion | Expand coverage in areas such as MFA or broader OAuth support where justified | Medium | Driven by practical usage and Better Auth support |
| I-014: Developer Experience Refinement | Improve ergonomics, discoverability, and consistency based on consumer feedback | Medium | Supports sustainable adoption |
| I-015: Adjacent Capability Evaluation | Assess additional features such as audit support or optional utilities only where they fit the product scope | Low | Prevents scope creep while leaving room for evolution |

### Note

Initiatives in this horizon remain intentionally flexible and may change based on implementation learning, external publication realities, and real consumer feedback.

---

## Dependencies

### Strategic Dependencies

| Dependency | Impact | Mitigation |
|------------|--------|------------|
| Better Auth | Core capability foundation | Constrain supported versions and validate compatibility regularly |
| Effect | Architectural foundation and runtime model | Track compatibility and review upgrades deliberately |
| External package distribution path | Required for public use | Validate packaging, registry access, and release workflow before publication |

### Consumer Validation Dependencies

| Dependency | Impact | Mitigation |
|------------|--------|------------|
| Availability of at least one real consuming project | Needed to validate usefulness and integration shape | Use internal-first adoption and test external install paths |
| Documentation quality | Needed for external usability | Tie docs to release readiness checkpoints |

---

## Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Better Auth changes disrupt the wrapper model | Medium | High | Validate supported versions and monitor compatibility actively |
| The library remains too coupled to the original monorepo | Medium | High | Review public boundaries and validate external consumption explicitly |
| Pattern inconsistency emerges as coverage expands | Medium | Medium | Use architecture guidance and review standards for new capabilities |
| Documentation drifts from implementation | Medium | Medium | Tie documentation updates to review and release checkpoints |
| External publication creates maintenance expectations beyond current capacity | Medium | Medium | Scope releases deliberately and set sustainable support expectations |
| Client-side expansion creates unnecessary breadth too early | Medium | Medium | Gate client-side work behind demonstrated usefulness |

---

## Success Measures

| Measure | Current | 2026 Target |
|---------|---------|-------------|
| Core server capability domains available | Partial | Email, OAuth, Session, Account, and User domains in release scope |
| Product documentation aligned to actual architecture | No | Yes |
| Stable initial public API baseline established | No | Yes |
| Release-quality automated validation for release scope | Partial | Yes |
| At least one real consuming project validated | No | Yes |
| External installation path proven outside original monorepo | No | Yes |
| npm publication readiness achieved | No | Yes |

---

## Backlog (Unprioritized)

| Idea | Source | Notes |
|------|--------|-------|
| Admin/auth management operations | Product | Consider only if aligned with Better Auth support and product scope |
| Broader OAuth provider utilities | Product | Candidate for later expansion |
| Optional audit-oriented utilities | Architecture | Assess only if they fit the product boundary |
| Client-side capability expansion | Consumer feedback | Prioritize only where justified by usage |
| Additional migration helpers | Developer experience | Useful if external onboarding becomes a pain point |

---

## Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-03-03 | Roadmap revised | Align roadmap to updated product vision and public-usable/internal-first product intent |

---

## Related Documentation

- [Product Vision](../vision/v1-product-vision.md)
