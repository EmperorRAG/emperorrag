# Project Documentation Hub

## Overview

This directory serves as the central repository for all project management and high-level technical documentation for the projects within this Nx monorepo. Unlike traditional code-level documentation that resides with the source code, this space is dedicated to the artifacts that guide the "why" and "how" of our development efforts from a strategic perspective.

The goal is to provide a clear, consistent, and accessible source of truth for product requirements, architectural decisions, and implementation strategies.

## Directory Structure

Each project within the monorepo has a corresponding documentation folder here. The structure mirrors the `apps/` and `packages/` directories at the root of the workspace.

- `docs/projects/<project-name>/`: Contains all project management documentation for `<project-name>`.

## Document Types

Within each project's documentation folder, you will find artifacts that cover the entire project lifecycle, including but not limited to:

- **Product Requirement Documents (PRDs)**: Defining the features, functionality, and user experience of a product.
- **Architecture Design Records (ADRs)**: Capturing significant architectural decisions, their context, and consequences.
- **Implementation Plans**: Outlining the technical approach, milestones, and tasks required to deliver a feature or project.
- **Specification Documents**: Providing detailed technical specifications for APIs, data models, and other components.
- **Agile Artifacts**:
  - **Epics**: High-level descriptions of large features.
  - **Features**: Collections of related user stories.
  - **User Stories**: Descriptions of a software feature from an end-user's perspective.

## The `summaries` Directory

A key component of each project's documentation folder is the `summaries` subdirectory. This folder contains high-level, non-technical descriptions of various aspects of the project. These summaries act as the foundational source material from which the more formal documents (like PRDs, ADRs, and user stories) are generated, ensuring consistency and alignment across all project artifacts.
