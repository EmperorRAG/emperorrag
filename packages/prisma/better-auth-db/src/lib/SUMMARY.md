---
post_title: Prisma Better Auth DB Library Summary
author1: EmperorRAG
post_slug: prisma-better-auth-db-lib-summary
microsoft_alias: n-a
featured_image: n-a
categories:
  - documentation
tags:
  - prisma
  - better-auth
  - nx
ai_note: Generated with AI assistance
summary: Overview of top-level assets within the lib directory of the prisma Better Auth DB package.
post_date: 2025-11-10
---

# Library Folder Overview

The `lib` directory contains the Better Auth integration glue, Prisma client exports, and supporting barrels used by the package build.

- **Workspace Path:** `packages/prisma/better-auth-db/src/lib`
- **Project Root Path:** `lib`

- [prisma-better-auth-db.ts](./prisma-better-auth-db.ts) — Consolidates exports for the package, wiring auth helpers and Prisma surfaces into a single barrel.
- [auth/](./auth/) — Hosts the Better Auth configuration and instances consumed by both client and server entry points.
- [prisma/](./prisma/) — Provides the Prisma client, generated schema assets, and associated barrels for downstream use.
