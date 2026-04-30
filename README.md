# 🚀 SmartTask AI: The Universal Orchestrator

A high-impact, multi-variant distributed system designed to master full-stack engineering, from core runtime to containerized deployment.

---

## 🏛️ Project Learning Roadmap

Follow the folders in sequence (01 to 08) to master the full stack:

| Step | Folder | Technology | Responsibility |
| :--- | :--- | :--- | :--- |
| **01** | `01-backend-node-native` | Raw Node.js (`http`) | **The Fundamentals**: Building a server without frameworks. |
| **02** | `02-backend-express` | Node.js + Express | **The Standard**: Middleware, Routing, and API Design. |
| **03** | `03-backend-nest` | NestJS | **The Enterprise**: Modular architecture and DI. |
| **04** | `04-backend-python-ai` | FastAPI + Gemini | **The Brain**: AI task processing and LLM integration. |
| **05** | `05-backend-java` | Spring Boot | **The Power**: JVM internals and complex multithreading. |
| **06** | `06-frontend-react` | React (Vite) | **The Interface**: Building a dynamic dashboard. |
| **07** | `07-frontend-next` | Next.js (App Router) | **The Full-Stack**: Server-side rendering and hydration. |
| **08** | `08-infra` | Docker / AWS | **The Deployment**: Containerization and CloudOps. |

---

## 🛠️ The "Conditional" Switch Matrix
Each backend variant supports these environment variables:

- `DB_TYPE`: `MONGO` | `POSTGRES`
- `BROKER_TYPE`: `RABBITMQ` | `BULLMQ` | `KAFKA`
- `AI_PROVIDER`: `GEMINI` | `MOCK`

---

## 🚦 How to Run
1. Navigate to a specific variant folder.
2. Follow the `README.md` inside that folder.
3. Use the root `docker-compose.yml` to spin up dependencies (Mongo, Postgres, Redis).

---
*Built for Mastery. Designed for Scale.*
