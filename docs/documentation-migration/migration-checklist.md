# Documentation Migration Checklist

Migration from SDLC stage-based structure to hybrid GitHub approach.

**Reference**: [migration-report.md](migration-report.md) for detailed specifications.

---

## Phase 1: GitHub Configuration

### Labels (Replacing Issue Types)

> **Note**: Issue Types require an organization account. Use labels + issue templates instead.

#### Type Labels

- [X] Create `type:epic` label (color: `#7057ff`)
- [X] Create `type:user-story` label (color: `#0e8a16`)
- [X] Create `type:bug` label (color: `#d73a4a`)
- [X] Create `type:task` label (color: `#1d76db`)
- [X] Create `type:feature` label (color: `#a2eeef`)

#### Priority Labels

- [X] Create `priority:critical` label (color: `#b60205`)
- [X] Create `priority:high` label (color: `#d93f0b`)
- [X] Create `priority:medium` label (color: `#fbca04`)
- [X] Create `priority:low` label (color: `#0e8a16`)

#### Status Labels

- [X] Create `status:blocked` label (color: `#000000`)
- [X] Create `status:in-progress` label (color: `#1d76db`)
- [X] Create `status:ready` label (color: `#0e8a16`)

### Issue Templates

- [X] Create `.github/ISSUE_TEMPLATE/epic.yml` (auto-applies `type:epic` label)
- [X] Create `.github/ISSUE_TEMPLATE/user-story.yml` (auto-applies `type:user-story` label)
- [X] Create `.github/ISSUE_TEMPLATE/bug-report.yml` (auto-applies `type:bug` label)
- [X] Create `.github/ISSUE_TEMPLATE/task.yml` (auto-applies `type:task` label)
- [X] Create `.github/ISSUE_TEMPLATE/config.yml` (optional: disable blank issues)

### PR Template

- [X] Create/update `.github/PULL_REQUEST_TEMPLATE.md` with code review checklist

### Release Configuration

- [X] Create `.github/release.yml` for auto-generated release notes

### GitHub Projects

- [X] Create project board with Roadmap view for planning
- [X] Configure iteration fields for sprints
- [X] Set up custom fields (priority, size, etc.)
- [X] Add custom "Type" single-select field (Epic, User Story, Bug, Task) as alternative categorization

---

## Phase 2: Workspace-Level Documentation Structure

### Create Workspace `/docs/` Directories

- [X] Create `docs/adr/` for cross-project architectural decisions
- [X] Create `docs/architecture/` for system-wide architecture
- [X] Create `docs/testing/` for organization-wide test strategy

### Populate Workspace Docs

- [X] Add `docs/testing/test-strategy.md` (workspace-level)
- [X] Add initial workspace ADRs if applicable
- [X] Add `docs/architecture/system-overview.md`

---

## Phase 3: Project-Level Documentation Structure

### Create Per-Project `/docs/` Directories

For each project (apps/packages), create type-based structure:

- [ ] `docs/adr/`
- [ ] `docs/api/`
- [ ] `docs/architecture/`
- [ ] `docs/data/`
- [ ] `docs/design/`
- [ ] `docs/migrations/`
- [ ] `docs/observability/`
- [ ] `docs/prd/`
- [ ] `docs/releases/`
- [ ] `docs/roadmap/`
- [ ] `docs/runbooks/`
- [ ] `docs/specs/`
- [ ] `docs/testing/`
- [ ] `docs/traceability/`
- [ ] `docs/vision/`

---

## Phase 4: Migrate Existing Documentation

### better-auth-utilities Project

#### 1-discovery → Type-based

- [ ] Move `product-vision.md` → `docs/vision/`
- [ ] Move `product-roadmap.md` → `docs/roadmap/`

#### 2-definition → Type-based

- [ ] Move `prd.md` → `docs/prd/`
- [ ] Embed `acceptance-criteria.md` into `docs/prd/prd.md`
- [ ] Move `test-strategy.md` → workspace `docs/testing/` or project `docs/testing/`

#### 3-planning → GitHub + Type-based

- [ ] Convert `epics.md` → GitHub Issues (template + `type:epic` label)
- [ ] Convert `user-stories.md` → GitHub Issues (template + `type:user-story` label)
- [ ] Move `rtm.md` → `docs/traceability/`

#### 4-design → Type-based

- [ ] Move `technical-design-doc.md` → `docs/design/`
- [ ] Move `architecture-diagrams.md` → `docs/architecture/`
- [ ] Move `adrs/` → `docs/adr/`
- [ ] Move `api-contract.md` → `docs/api/`
- [ ] Move `integration-contract.md` → `docs/api/`
- [ ] Move `data-model.md` → `docs/data/`
- [ ] Move `monitoring-spec.md` → `docs/observability/`

#### 5-build → Type-based + GitHub

- [ ] Move `technical-spec.md` → `docs/specs/`
- [ ] Move `db-migration.md` → `docs/migrations/`
- [ ] Delete `unit-tests.md` (code only)
- [ ] Delete `integration-tests.md` (code only)
- [ ] Delete `pull-request.md` (use PR template)
- [ ] Merge `code-review-checklist.md` into PR template

#### 6-test → Type-based + GitHub

- [ ] Move `test-plan.md` → `docs/testing/`
- [ ] Move `test-cases.md` → `docs/testing/`
- [ ] Delete `test-execution-report.md` (CI artifacts)
- [ ] Merge `rtm-update.md` into `docs/traceability/rtm.md`
- [ ] Convert `bug-reports.md` → GitHub Issues (template + `type:bug` label)

#### 7-release → Type-based + GitHub

- [ ] Move `release-plan.md` → `docs/releases/`
- [ ] Move `qa-signoff.md` → `docs/releases/`
- [ ] Delete `release-notes.md` (use GitHub Releases)
- [ ] Delete `changelog-entry.md` (use GitHub Releases)

#### 8-operate → Type-based

- [ ] Move `runbook.md` → `docs/runbooks/`
- [ ] Move `post-release-review.md` → `docs/releases/`

#### Cleanup

- [ ] Remove empty `sdlc/` directory structure

---

## Phase 5: Update Agents and Prompts

### Orchestrator Agents

- [ ] Update Discovery Orchestrator output paths
- [ ] Update Definition Orchestrator output paths
- [ ] Update Planning Orchestrator (GitHub Issues with labels)
- [ ] Update Design Orchestrator output paths
- [ ] Update Build Orchestrator output paths
- [ ] Update Test Orchestrator (GitHub Issues with `type:bug` label)
- [ ] Update Release Orchestrator (GitHub Releases integration)
- [ ] Update Operate Orchestrator output paths

### Artefact Instructions

- [ ] Update artefact instruction `applyTo` patterns
- [ ] Remove instructions for GitHub-native artefacts (epic, user-story, bug-report, pull-request, release-notes, changelog-entry)
- [ ] Update templates for new file locations

### Reusable Prompts

- [ ] Update prompt file paths and references
- [ ] Add prompts for GitHub Issue creation (with labels)
- [ ] Add prompts for GitHub Release creation

---

## Phase 6: Copilot Spaces Setup

### Workspace-Level Spaces

- [ ] Create **Onboarding** Space
- [ ] Create **Test Strategy** Space
- [ ] Create **System Architecture** Space

### Per-Project Spaces

- [ ] Create **Product Strategy** Space per project
- [ ] Create **Architecture** Space per project
- [ ] Create **API & Integration** Space per project
- [ ] Create **QA & Testing** Space per project
- [ ] Create **Operations** Space per project

### Configure Sources

- [ ] Link repo files to appropriate Spaces
- [ ] Add Space instructions for each Space
- [ ] Configure sharing (private by default; invite specific collaborators as needed)

> **Note**: Individual accounts cannot use organization-wide sharing. Spaces are private by default and can be shared with specific GitHub users.

---

## Phase 7: Validation and Cleanup

### Validate Migration

- [ ] Verify all docs accessible from new locations
- [ ] Test Copilot Spaces queries work correctly
- [ ] Confirm GitHub Issues with labels/templates work correctly
- [ ] Confirm GitHub Releases integration works
- [ ] Run agents end-to-end with new paths

### Documentation Updates

- [ ] Update `AGENTS.md` with new documentation structure
- [ ] Update `llms.md` with new doc locations
- [ ] Add migration notes to project READMEs

### Cleanup

- [ ] Remove old `sdlc/` directories after validation
- [ ] Archive migration documentation (optional)
- [ ] Update any external references to old paths

---

## Progress Summary

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 1: GitHub Configuration | ⬜ Not Started | |
| Phase 2: Workspace Docs | ⬜ Not Started | |
| Phase 3: Project Docs Structure | ⬜ Not Started | |
| Phase 4: Migrate Existing Docs | ⬜ Not Started | |
| Phase 5: Update Agents/Prompts | ⬜ Not Started | |
| Phase 6: Copilot Spaces | ⬜ Not Started | |
| Phase 7: Validation/Cleanup | ⬜ Not Started | |
