## Revised GitHub Artefact Management Report (Hybrid Approach for Nx Monorepo)

### Context

You have an Nx monorepo with SDLC documentation currently organized by lifecycle stage within each project (e.g., 1-discovery). You use Copilot Chat agents and orchestrators to generate these artefacts.

This report recommends the **hybrid approach** with documentation organized by **type** rather than SDLC stage, which provides:

- Better discoverability (all ADRs together, all API contracts together)
- Cleaner Copilot Spaces organization (topic-based, not stage-based)
- Easier cross-project reference
- Standard industry conventions (`/docs/adr/`, `/docs/api/`, etc.)

### Constraint: No Organization Issue Types

GitHub Issue Types require an organization account. This report uses **labels + issue templates** as an equivalent solution for categorizing work items (epics, user stories, bugs).

---

## Artefact Classification for GitHub

### 1. Create on GitHub (Native Features) — Not Repo Markdown

| Artefact | Current Location | GitHub Feature | Notes |
|----------|------------------|----------------|-------|
| **Bug Report** | `6-test/bug-reports.md` | GitHub Issues + `type:bug` label | Use `bug-report.yml` template, one issue per bug |
| **Epic** | `3-planning/epics.md` | GitHub Issues + `type:epic` label | Use `epic.yml` template, link child stories via sub-issues |
| **User Story** | `3-planning/user-stories.md` | GitHub Issues + `type:user-story` label | Use `user-story.yml` template, acceptance criteria in body |
| **Pull Request** | `5-build/pull-request.md` | GitHub Pull Requests | Use PR template, not separate doc |
| **Release Notes** | `7-release/release-notes.md` | GitHub Releases | Auto-generate from PRs |
| **Changelog Entry** | `7-release/changelog-entry.md` | GitHub Releases | Combined with release notes |

### 2. Store in Repo + Link to Copilot Spaces (Hybrid)

These remain as versioned markdown, reorganized by type:

| Artefact | Current Location | New Location | Scope |
|----------|------------------|--------------|-------|
| **Product Vision** | `1-discovery/product-vision.md` | `docs/vision/` | Per-project |
| **Product Roadmap** | `1-discovery/product-roadmap.md` | `docs/roadmap/` | Per-project |
| **PRD** | `2-definition/prd.md` | `docs/prd/` | Per-project |
| **Acceptance Criteria** | `2-definition/acceptance-criteria.md` | `docs/prd/` (embedded) | Per-PRD |
| **Test Strategy** | `2-definition/test-strategy.md` | `docs/testing/` | Workspace-level |
| **RTM** | `3-planning/rtm.md` | `docs/traceability/` | Per-project |
| **Technical Design Doc** | `4-design/technical-design-doc.md` | `docs/design/` | Per-feature |
| **Architecture Diagrams** | `4-design/architecture-diagrams.md` | `docs/architecture/` | Per-project |
| **ADRs** | `4-design/adrs/` | `docs/adr/` | Per-project or workspace |
| **API Contract** | `4-design/api-contract.md` | `docs/api/` | Per-service |
| **Integration Contract** | `4-design/integration-contract.md` | `docs/api/` | Per-integration |
| **Data Model** | `4-design/data-model.md` | `docs/data/` | Per-project |
| **Monitoring Spec** | `4-design/monitoring-spec.md` | `docs/observability/` | Per-service |
| **Technical Spec** | `5-build/technical-spec.md` | `docs/specs/` | Per-module |
| **DB Migration** | `5-build/db-migration.md` | `docs/migrations/` | Per-migration |
| **Code Review Checklist** | `5-build/code-review-checklist.md` | `.github/PULL_REQUEST_TEMPLATE.md` | Workspace-level |
| **Unit Tests** | `5-build/unit-tests.md` | Code files only | N/A (code) |
| **Integration Tests** | `5-build/integration-tests.md` | Code files only | N/A (code) |
| **Test Plan** | `6-test/test-plan.md` | `docs/testing/` | Per-release |
| **Test Cases** | `6-test/test-cases.md` | `docs/testing/` | Per-feature |
| **Test Execution Report** | `6-test/test-execution-report.md` | CI artifacts | Generated |
| **RTM Update** | `6-test/rtm-update.md` | `docs/traceability/` (update) | Merged into RTM |
| **Release Plan** | `7-release/release-plan.md` | `docs/releases/` | Per-release |
| **QA Sign-off** | `7-release/qa-signoff.md` | `docs/releases/` | Per-release |
| **Runbook** | `8-operate/runbook.md` | `docs/runbooks/` | Per-service |
| **Post-Release Review** | `8-operate/post-release-review.md` | `docs/releases/` | Per-release |

---

## GitHub Labels (Replacing Issue Types)

Since Issue Types require an organization account, create these labels:

### Type Labels

| Label | Color | Description |
|-------|-------|-------------|
| `type:epic` | `#7057ff` | Large body of work with sub-issues |
| `type:user-story` | `#0e8a16` | User-facing feature with acceptance criteria |
| `type:bug` | `#d73a4a` | Defect or unexpected behavior |
| `type:task` | `#1d76db` | Technical task or chore |
| `type:feature` | `#a2eeef` | New feature request |

### Priority Labels

| Label | Color | Description |
|-------|-------|-------------|
| `priority:critical` | `#b60205` | Must fix immediately |
| `priority:high` | `#d93f0b` | Important, address soon |
| `priority:medium` | `#fbca04` | Normal priority |
| `priority:low` | `#0e8a16` | Nice to have |

### Status Labels

| Label | Color | Description |
|-------|-------|-------------|
| `status:blocked` | `#000000` | Waiting on dependency |
| `status:in-progress` | `#1d76db` | Currently being worked on |
| `status:ready` | `#0e8a16` | Ready for development |

---

## GitHub Issue Templates

Create in `.github/ISSUE_TEMPLATE/`:

| Template | File | Auto-Labels | Purpose |
|----------|------|-------------|---------|
| Epic | `epic.yml` | `type:epic` | Large initiative with linked stories |
| User Story | `user-story.yml` | `type:user-story` | Feature from user perspective |
| Bug Report | `bug-report.yml` | `type:bug` | Defect with reproduction steps |
| Task | `task.yml` | `type:task` | Technical work item |

---

## Recommended Documentation Structure

### Nx Monorepo: Workspace vs Project Docs

```
emperorrag/                              # Workspace root
├── .github/
│   ├── ISSUE_TEMPLATE/                 # Issue templates (replace issue types)
│   │   ├── epic.yml
│   │   ├── user-story.yml
│   │   ├── bug-report.yml
│   │   └── task.yml
│   ├── PULL_REQUEST_TEMPLATE.md        # PR template with code review checklist
│   └── release.yml                     # Auto-generated release notes config
│
├── docs/                                # Workspace-level documentation
│   ├── adr/                            # Cross-project architectural decisions
│   │   └── 001-nx-monorepo.md
│   ├── testing/
│   │   └── test-strategy.md            # Workspace-wide test strategy
│   └── architecture/
│       └── system-overview.md          # Cross-project architecture
│
├── apps/
│   └── better-auth-nest-js-microservice/
│       └── docs/                       # Project-specific documentation
│           ├── adr/                    # Project-specific decisions
│           ├── api/                    # API contracts for this service
│           ├── design/                 # Technical designs
│           ├── prd/                    # Product requirements
│           ├── runbooks/               # Operational runbooks
│           └── ...
│
├── packages/
│   └── better-auth-utilities/
│       └── docs/                       # Library documentation
│           ├── adr/
│           ├── api/
│           ├── design/
│           ├── prd/
│           ├── vision/
│           ├── roadmap/
│           ├── data/
│           ├── testing/
│           ├── traceability/
│           ├── specs/
│           ├── releases/
│           └── observability/
```

### Per-Project docs Structure (Hybrid Approach)

```
packages/better-auth-utilities/docs/
├── adr/
│   ├── 001-controller-service-architecture.md   # From: 4-design/adrs/
│   └── template.md
├── api/
│   ├── api-contract.md                          # From: 4-design/api-contract.md
│   └── integration-contract.md                  # From: 4-design/integration-contract.md
├── architecture/
│   └── diagrams.md                              # From: 4-design/architecture-diagrams.md
├── data/
│   └── data-model.md                            # From: 4-design/data-model.md
├── design/
│   └── technical-design-doc.md                  # From: 4-design/technical-design-doc.md
├── migrations/
│   └── db-migration.md                          # From: 5-build/db-migration.md
├── observability/
│   └── monitoring-spec.md                       # From: 4-design/monitoring-spec.md
├── prd/
│   └── prd.md                                   # From: 2-definition/prd.md (includes AC)
├── releases/
│   ├── v1.0-release-plan.md                     # From: 7-release/release-plan.md
│   ├── v1.0-qa-signoff.md                       # From: 7-release/qa-signoff.md
│   └── v1.0-post-release-review.md              # From: 8-operate/post-release-review.md
├── roadmap/
│   └── product-roadmap.md                       # From: 1-discovery/product-roadmap.md
├── runbooks/
│   └── runbook.md                               # From: 8-operate/runbook.md
├── specs/
│   └── technical-spec.md                        # From: 5-build/technical-spec.md
├── testing/
│   ├── test-plan.md                             # From: 6-test/test-plan.md
│   └── test-cases.md                            # From: 6-test/test-cases.md
├── traceability/
│   └── rtm.md                                   # From: 3-planning/rtm.md
└── vision/
    └── product-vision.md                        # From: 1-discovery/product-vision.md
```

---

## Copilot Spaces Structure for Nx Monorepo

### Constraint: Individual Account (No Organization)

Copilot Spaces without an organization account:

- Spaces are **private by default**
- Can be shared with **specific GitHub users** (not organization-wide)
- No organization-level Space templates or centralized management

### Workspace-Level Spaces

| Space Name | Sources | Purpose |
|------------|---------|---------|
| **Onboarding** | AGENTS.md, llms.md, instructions, workspace `docs/adr/` | New team member context |
| **Test Strategy** | `docs/testing/test-strategy.md`, all `*/vitest.config.ts`, `*/jest.config.ts` | Workspace-wide QA approach |
| **System Architecture** | Workspace `docs/architecture/`, cross-project ADRs | High-level system understanding |

### Per-Project Spaces

For `better-auth-utilities`:

| Space Name | Sources | Purpose |
|------------|---------|---------|
| **Product Strategy** | `docs/vision/`, `docs/prd/`, `docs/roadmap/`, `docs/traceability/` | Product direction queries |
| **Architecture** | `docs/adr/`, `docs/design/`, `docs/architecture/`, `docs/data/`, `docs/specs/` | Technical decision context |
| **API & Integration** | `docs/api/`, `src/**/*.ts` (key files) | API usage guidance |
| **QA & Testing** | `docs/testing/`, `docs/traceability/`, test files | Test planning context |
| **Operations** | `docs/runbooks/`, `docs/observability/`, `docs/releases/` | On-call and release context |

---

## Migration Path: SDLC Stages → Type-Based Structure

### Current → New Mapping

| SDLC Stage | Current Path | New Path | GitHub Feature (if applicable) |
|------------|--------------|----------|-------------------------------|
| **1-discovery** | | | |
| product-vision.md | `1-discovery/` | `docs/vision/` | — |
| product-roadmap.md | `1-discovery/` | `docs/roadmap/` | + GitHub Projects (Roadmap) |
| **2-definition** | | | |
| prd.md | `2-definition/` | `docs/prd/` | — |
| acceptance-criteria.md | `2-definition/` | Embed in `docs/prd/` or issues | Issue checkboxes |
| test-strategy.md | `2-definition/` | `docs/testing/` (workspace) | — |
| **3-planning** | | | |
| epics.md | `3-planning/` | **GitHub Issues** | Template + `type:epic` label |
| user-stories.md | `3-planning/` | **GitHub Issues** | Template + `type:user-story` label |
| rtm.md | `3-planning/` | `docs/traceability/` | — |
| **4-design** | | | |
| technical-design-doc.md | `4-design/` | `docs/design/` | — |
| architecture-diagrams.md | `4-design/` | `docs/architecture/` | — |
| adrs/ | `4-design/adrs/` | `docs/adr/` | — |
| api-contract.md | `4-design/` | `docs/api/` | — |
| integration-contract.md | `4-design/` | `docs/api/` | — |
| data-model.md | `4-design/` | `docs/data/` | — |
| monitoring-spec.md | `4-design/` | `docs/observability/` | — |
| **5-build** | | | |
| technical-spec.md | `5-build/` | `docs/specs/` | — |
| db-migration.md | `5-build/` | `docs/migrations/` | — |
| unit-tests.md | `5-build/` | **Code only** | — |
| integration-tests.md | `5-build/` | **Code only** | — |
| pull-request.md | `5-build/` | **GitHub PRs** | PR template |
| code-review-checklist.md | `5-build/` | `.github/PULL_REQUEST_TEMPLATE.md` | — |
| **6-test** | | | |
| test-plan.md | `6-test/` | `docs/testing/` | — |
| test-cases.md | `6-test/` | `docs/testing/` | — |
| test-execution-report.md | `6-test/` | **CI artifacts** | — |
| rtm-update.md | `6-test/` | Update `docs/traceability/rtm.md` | — |
| bug-reports.md | `6-test/` | **GitHub Issues** | Template + `type:bug` label |
| **7-release** | | | |
| release-plan.md | `7-release/` | `docs/releases/` | + GitHub Milestones |
| qa-signoff.md | `7-release/` | `docs/releases/` | — |
| release-notes.md | `7-release/` | **GitHub Releases** | Auto-generated |
| changelog-entry.md | `7-release/` | **GitHub Releases** | Auto-generated |
| **8-operate** | | | |
| runbook.md | `8-operate/` | `docs/runbooks/` | — |
| post-release-review.md | `8-operate/` | `docs/releases/` | — |
| monitoring-alerts.md | `8-operate/` | `docs/observability/` | — |

---

## Summary: What Lives Where

| Destination | Artefacts |
|-------------|-----------|
| **GitHub Issues** | Epic (`type:epic`), User Story (`type:user-story`), Bug Report (`type:bug`) |
| **GitHub Pull Requests** | Pull Request (use template) |
| **GitHub Releases** | Release Notes, Changelog Entry |
| **GitHub Projects** | Product Roadmap (visual tracking) |
| **GitHub Milestones** | Release Plan (schedule tracking) |
| **Repo: `docs/vision/`** | Product Vision |
| **Repo: `docs/roadmap/`** | Product Roadmap (narrative) |
| **Repo: `docs/prd/`** | PRD, Acceptance Criteria |
| **Repo: `docs/adr/`** | Architecture Decision Records |
| **Repo: `docs/design/`** | Technical Design Doc |
| **Repo: `docs/architecture/`** | Architecture Diagrams |
| **Repo: `docs/api/`** | API Contract, Integration Contract |
| **Repo: `docs/data/`** | Data Model |
| **Repo: `docs/specs/`** | Technical Spec |
| **Repo: `docs/migrations/`** | DB Migration docs |
| **Repo: `docs/testing/`** | Test Strategy, Test Plan, Test Cases |
| **Repo: `docs/traceability/`** | RTM |
| **Repo: `docs/releases/`** | Release Plan, QA Sign-off, Post-Release Review |
| **Repo: `docs/runbooks/`** | Runbook |
| **Repo: `docs/observability/`** | Monitoring Spec |
| **Repo: .github** | PR Template, Issue Templates, Release Config |
| **Code files** | Unit Tests, Integration Tests |
| **CI artifacts** | Test Execution Report |
| **Copilot Spaces** | References all above for AI-powered access |

---

## Future Work: Agent/Prompt Updates

When you update your orchestrator agents, artefact instructions, and prompts:

1. **Update output paths** from `{projectPath}/sdlc/{stage}/` to `{projectPath}/docs/{type}/`
2. **Remove artefacts that become GitHub features**: epics.md, user-stories.md, bug-reports.md, pull-request.md, release-notes.md, changelog-entry.md
3. **Add GitHub API calls** for creating Issues (with labels), Releases, etc. (via `github/*` tools)
4. **Merge related docs**: acceptance-criteria.md → embed in prd.md; rtm-update.md → update rtm.md in place
5. **Add Copilot Spaces creation** as a post-SDLC step to organize project context
