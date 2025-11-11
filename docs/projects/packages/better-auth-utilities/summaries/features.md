# Better Auth Utilities Feature Summaries

This document provides high-level, non-technical summaries of the key feature areas within the `better-auth-utilities` package.

## Client Features

This feature area relates to the client-centric API provided by Better Auth's `createAuthClient` function. Utilities here are designed to be environment-agnostic, meaning they can run in both Node.js and non-Node.js environments (like browsers). Functionality that depends on environment-specific packages (e.g., `nodemailer` for server-side email) is excluded or abstracted. These client-compatible utilities focus on tasks like session management, user interactions, and accessing authentication state from any JavaScript-enabled client.

## Server Features

As the counterpart to client features, this area corresponds to the server-only API created by Better Auth's `betterAuth` function. These utilities are intended for use in a Node.js backend environment and can leverage server-specific capabilities. They provide tools to secure endpoints, manage permissions, handle session validation, and perform other authentication-related tasks that require a trusted server context.

## Config Features

Configuration features provide builders and schemas to simplify the setup of Better Auth. These utilities help ensure that both client and server configurations are consistent, valid, and easy to manage, reducing the chance of misconfiguration.

## Core Better Auth Features

These are the fundamental building blocks of the authentication system, wrapped by the utility library for easier use.

- **Email**: Utilities for handling email-based authentication flows, such as sending verification links and password reset emails.
- **Password**: Helpers for securely managing user passwords, including hashing, verification, and strength validation.
- **Database**: Abstractions for interacting with the user database, simplifying tasks like creating, retrieving, and updating user records.
- **Session**: Tools for managing user sessions, including creating session tokens, validating them, and handling session expiration.

## Plugins Features

This area covers functionality related to the plugins offered by the Better Auth package, such as `Username`, `OAuth`, and `OTP`. The utilities here provide helpers and abstractions to simplify the integration and management of these plugins, allowing for the easy extension of core authentication with additional strategies like social logins or one-time passwords.

## Adapter API Features

Adapters provide different ways to use the Better Auth utilities, catering to various programming styles and architectures. This allows developers to choose the approach that best fits their project.

- **Event-Driven Adapters**: For systems that use an event-based architecture, allowing services to react to authentication events (like `user.signedin`).
- **Async/Await (Promise) Adapters**: The most common approach for modern JavaScript, providing simple `async` functions for interacting with the API.
- **Class-Based Adapters**: For developers who prefer object-oriented programming, wrapping the functionality in classes and methods.
