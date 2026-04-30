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
