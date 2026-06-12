# 📑 Architectural Decisions (ADR)

This file tracks the "Why" behind every major technical choice in SmartTask AI.

---

## 🟢 ADR 001: Multi-Variant Architecture
- **Date**: 2026-04-30
- **Status**: Accepted
- **Context**: The goal is to learn Node.js, NestJS, and Java deeply by comparing them.
- **Decision**: We will implement the same API contract across three different backend languages/frameworks.
- **Consequence**: We must maintain a single `api-spec.yaml` (Swagger) to ensure all backends are interchangeable.

## 🟢 ADR 002: Hexagonal Architecture (The Switch)
- **Date**: 2026-04-30
- **Status**: Accepted
- **Context**: We want to master both SQL and NoSQL.
- **Decision**: We will use the **Repository Pattern** to allow switching between MongoDB and PostgreSQL using an environment variable.
- **Consequence**: We cannot use database-specific features (like Mongo-specific aggregation) in the core business logic.

## 🟢 ADR 003: Asynchronous AI Integration
- **Date**: 2026-04-30
- **Status**: Accepted
- **Context**: AI tasks (Gemini) can take 5-10 seconds, which would block an HTTP request.
- **Decision**: Use a **Message Broker** (RabbitMQ/BullMQ) to handle tasks asynchronously. The backend will return a `202 Accepted` immediately.
- **Consequence**: We need a way (WebSockets or Polling) to notify the frontend when the task is done.

## 🟢 ADR 004: PHP Laravel MVC Stack
- **Date**: 2026-06-12
- **Status**: Accepted
- **Context**: We want to support a PHP-based backend to compare pattern architectures.
- **Decision**: Implement the SmartTask API using Laravel 11 following standard Laravel MVC conventions (Repositories for DB, Form Requests for validation, API Resources for transformations, and AppServiceProvider for IoC DI).
- **Consequence**: All business logic matches the other backends, but leverages native PHP patterns.

## 🟢 ADR 005: Ionic + Angular Frontend Stack
- **Date**: 2026-06-12
- **Status**: Accepted
- **Context**: We need a mobile-first / cross-platform PWA frontend implementation.
- **Decision**: Implement using Ionic 8 and Angular 20, using Angular Signals for state management and an HTTP interceptor for automatic base URL / token injection.
- **Consequence**: Users get a responsive mobile interface that communicates interchangeably with any of the backend variants.

