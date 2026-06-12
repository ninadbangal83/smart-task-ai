# 🐘 SmartTask AI — Laravel Backend (Step 07)

The PHP/Laravel implementation of the SmartTask AI backend. Implements the **same REST API contract** as all other backend variants.

---

## 🏛️ Architecture — Laravel MVC + Repository Pattern

```
app/
├── Models/                          ← M in MVC (Eloquent Models)
│   ├── Task.php                     Relationships, scopes, canBeDeleted()
│   └── User.php                     isAdmin(), owns(), $hidden=['password']
│
├── Http/                            ← C in MVC (Controllers + Middleware)
│   ├── Controllers/
│   │   ├── AuthController.php       register, login
│   │   ├── TaskController.php       index, show, store, update, destroy
│   │   └── UserController.php       me, updateMe, deleteMe, admin endpoints
│   ├── Requests/                    ← Form Request Validation (Laravel standard)
│   │   ├── Auth/RegisterRequest.php
│   │   ├── Auth/LoginRequest.php
│   │   └── Task/CreateTaskRequest.php
│   ├── Resources/                   ← API Response Transformation
│   │   ├── TaskResource.php         snake_case DB → camelCase API
│   │   └── UserResource.php         always strips password
│   └── Middleware/
│       ├── AuthMiddleware.php       JWT/Session strategy selection
│       └── AdminMiddleware.php      role-based protection
│
├── Services/                        ← Business Logic Layer
│   ├── TaskService.php              Cache-Aside, broker publish, auth checks
│   ├── AuthService.php              register (1st user = admin), login, hash
│   ├── UserService.php              profile CRUD, admin overrides
│   ├── Auth/
│   │   ├── AuthStrategyInterface.php
│   │   ├── JwtAuthStrategy.php      Bearer token, X-Auth-Token header
│   │   └── SessionAuthStrategy.php  session()->put/get, regenerate()
│   └── Broker/
│       ├── BrokerInterface.php
│       ├── RabbitMQBroker.php       php-amqplib
│       └── BullMQBroker.php         Redis RPUSH (via Laravel Redis facade)
│
├── Repositories/                    ← Data Access Layer
│   ├── Contracts/
│   │   ├── TaskRepositoryInterface.php
│   │   └── UserRepositoryInterface.php
│   ├── TaskRepository.php           All Task DB queries
│   └── UserRepository.php           All User DB queries
│
├── Providers/
│   └── AppServiceProvider.php      ← IoC bindings (Interface → Implementation)
│
└── Exceptions/
    └── AppException.php             AppException → NotFoundEx, ForbiddenEx, etc.
```

---

## 🔀 Switch Matrix (same as all other backends)

| Variable | Options | Default |
|---|---|---|
| `DB_TYPE` | `POSTGRES` | `POSTGRES` |
| `BROKER_TYPE` | `BULLMQ` \| `RABBITMQ` | `BULLMQ` |
| `AUTH_TYPE` | `JWT` \| `SESSION` | `JWT` |
| `AI_PROVIDER` | `GEMINI` \| `MOCK` | `MOCK` |

---

## 🔑 Key PHP/Laravel Patterns Used

| Pattern | Where | What it replaces from Node |
|---|---|---|
| **Constructor DI** | All Services, Controllers, Middleware | `static` methods / factory calls |
| **IoC Container** | `AppServiceProvider.php` | `RepositoryFactory`, `BrokerFactory`, `AuthFactory` |
| **Form Requests** | `Http/Requests/` | Manual `if(!email)` validation in controllers |
| **API Resources** | `Http/Resources/` | `mapToEntity()` / `ResponseUtil.success()` |
| **Eloquent Scopes** | `Task::scopeForUser()` | `query.userId = userId` conditionals |
| **Laravel Cache** | `Cache::put/get/forget()` | `RedisService.set/get/del()` |
| **Laravel Log** | `Log::info/debug/warning()` | `LoggerFactory.getLogger().info()` |

---

## 🚀 Setup & Run

### 1. Install PHP dependencies
```bash
cd 07-backend-laravel
composer install
```

### 2. Configure environment
```bash
cp .env.example .env
php artisan key:generate
```

Edit `.env` — set `DB_CONNECTION`, database credentials, Redis, RabbitMQ if needed.

### 3. Start infrastructure (from project root)
```bash
docker-compose up -d
```

### 4. Run migrations
```bash
php artisan migrate
```

### 5. Start server (port 8000)
```bash
php artisan serve --port=8000
```

### 6. Test Health
```bash
curl http://localhost:8000/api/health
```

---

## 🔗 API Endpoints

All endpoints mirror the other backend variants exactly.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Server status + config |
| `POST` | `/api/auth/register` | Public | Register (1st user = admin) |
| `POST` | `/api/auth/login` | Public | Login (returns JWT or sets session) |
| `GET` | `/api/tasks` | 🔐 | Get my tasks |
| `POST` | `/api/tasks` | 🔐 | Create task (→ queues AI job) |
| `GET` | `/api/tasks/{id}` | 🔐 | Get task (with Redis cache) |
| `PUT` | `/api/tasks/{id}` | 🔐 | Update task |
| `DELETE` | `/api/tasks/{id}` | 🔐 | Delete task (guard: no completed) |
| `GET` | `/api/users/me` | 🔐 | My profile |
| `GET` | `/api/admin/users` | 👑 Admin | All users |

---

*SmartTask AI — Laravel variant. Built for learning Laravel MVC + Repository Pattern.*
