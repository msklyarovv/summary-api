# summary-api

Цифровая визитка Михаила Склярова — GraphQL API на NestJS + Prisma + PostgreSQL + Docker.

## Быстрый старт

```bash
docker-compose up --build
# Apollo Sandbox: http://localhost:3000/graphql
# Health check:   http://localhost:3000/health
```

### Локальная разработка без Docker

```bash
# 1. Поднять только БД
docker-compose -f docker-compose.dev.yml up -d

# 2. Установить зависимости
npm install

# 3. Применить миграции
npx prisma migrate dev

# 4. Запустить в watch-режиме
npm run start:dev
```

---

## Примеры запросов

**Полный профиль:**
```graphql
query {
  profile {
    name
    description
    email
    telegram
    links { label url }
    skills { name category }
    experience {
      company
      position
      startDate
      endDate
      achievements
      stack
    }
    projects { name description url }
  }
}
```

**Только Frontend-навыки:**
```graphql
query {
  profile {
    name
    skills(category: "Frontend") { name }
  }
}
```

**Статистика просмотров:**
```graphql
query {
  profileStats {
    viewCount
    lastViewedAt
  }
}
```

---

## Деплой на VPS

### Подготовка сервера

```bash
# Установить Docker и Docker Compose
curl -fsSL https://get.docker.com | sh
apt-get install -y docker-compose-plugin make git

# Клонировать репозиторий
git clone https://github.com/msklyarovv/summary-api.git
cd summary-api

# Создать .env из шаблона
cp .env.production.example .env
nano .env  # задать POSTGRES_PASSWORD
```

### Self-signed SSL (без домена)

```bash
make ssl-init
make prod-up
```

### Let's Encrypt SSL (с доменом)

```bash
# 1. Прописать домен в nginx/nginx.conf (server_name your-domain.com)
# 2. Запустить без SSL для подтверждения домена
#    (раскомментировать блок HTTP-only в nginx.conf)
make prod-up

# 3. Получить сертификат
docker run --rm -v certbot_conf:/etc/letsencrypt \
  -v certbot_www:/var/www/certbot \
  certbot/certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  -d your-domain.com

# 4. Раскомментировать SSL в nginx.conf, перезапустить nginx
make prod-up
```

### Обновление приложения

```bash
make deploy
# = git pull + rebuild только api + migrate
```

---

## Архитектурные решения

### Code First GraphQL

TypeScript-классы с декораторами — единственный источник правды для схемы.
Схема генерируется автоматически (`autoSchemaFile: true`).

### DataLoader — решение N+1

Все связанные данные (skills, experience, projects) загружаются через DataLoader с `Scope.REQUEST`.

Без DataLoader — N+1 запросов к БД:
```
SELECT * FROM profiles;
SELECT * FROM skills WHERE profileId = 'a';  -- ×N
```

С DataLoader — всегда 2 запроса:
```
SELECT * FROM profiles;
SELECT * FROM skills WHERE profileId IN ('a', 'b', 'c');
```

`Scope.REQUEST` гарантирует, что кэш DataLoader не утекает между запросами пользователей.

### ICacheService — точка роста

Абстракция кэш-слоя готова в `src/common/cache/`.
Текущая реализация: `NullCacheService` (no-op).

**Что нужно для Redis:**
```typescript
// src/common/cache/redis-cache.service.ts
@Injectable()
export class RedisCacheService implements ICacheService {
  // реализация через ioredis
}

// src/common/cache/cache.module.ts
providers: [{ provide: ICacheService, useClass: RedisCacheService }]
```

Бизнес-логика не меняется. Первый кандидат на кэширование: результат `profile()` с TTL 60 секунд.

### ProfileStats — in-memory + точка роста

`profileStats` query возвращает счётчик просмотров.
Хранится в памяти → сбрасывается при рестарте, не масштабируется горизонтально.

**Следующий шаг:** персистировать через `ICacheService` → Redis.
Дополнительно: аналитика по времени суток, уникальные посетители (по хэшу IP).

### Защита API

| Слой | Механизм |
|---|---|
| HTTP | Helmet (security headers) |
| HTTP | CORS (разрешён любой origin — публичный API) |
| HTTP | ThrottlerModule (rate limit: 100 req/мин) |
| GraphQL | ComplexityPlugin (лимит сложности запроса, настраивается через env) |
| Nginx | rate limiting (30 req/sec, burst 20) |
| Nginx | HTTPS + HSTS |
| Prod | `formatError` скрывает внутренние детали ошибок |

### Разделение ответственности

```
Resolver   — GraphQL-интерфейс (аргументы, маппинг типов)
Service    — бизнес-логика + Prisma
Loader     — батчинг и кэширование DB-запросов (DataLoader)
```

### Инициализация БД

`SeedService` (OnApplicationBootstrap) — идемпотентный автозапуск при старте.
Данные — единственный источник правды в `src/seed/seed.data.ts`.
`prisma/seed.ts` — CLI-альтернатива для ручного заполнения.

### Структура проекта

```
src/
├── config/           # appConfig — все env переменные
├── prisma/           # PrismaService (global singleton)
├── common/
│   ├── scalars/      # DateTime scalar
│   ├── plugins/      # ComplexityPlugin
│   ├── cache/        # ICacheService + NullCacheService
│   └── utils/        # groupBy и другие утилиты
├── profile/          # профиль, resolver, stats
├── skill/            # навыки: service + DataLoader
├── experience/       # опыт: service + DataLoader
├── project/          # проекты: service + DataLoader
├── health/           # GET /health
└── seed/             # SeedService + seed.data.ts
nginx/
└── nginx.conf        # production reverse proxy
prisma/
├── schema.prisma
├── seed.ts           # CLI seed
└── migrations/
```

---

## Переменные окружения

| Переменная | Значение по умолчанию | Описание |
|---|---|---|
| `DATABASE_URL` | — | PostgreSQL connection string |
| `NODE_ENV` | `development` | Режим работы |
| `PORT` | `3000` | HTTP-порт |
| `GRAPHQL_INTROSPECTION` | `true` | Introspection (в prod рекомендуется `false`) |
| `GRAPHQL_MAX_COMPLEXITY` | `50` | Лимит сложности GraphQL-запроса |
| `THROTTLE_TTL` | `60000` | Окно rate limit (мс) |
| `THROTTLE_LIMIT` | `100` | Макс. запросов за окно |
| `POSTGRES_PASSWORD` | — | Пароль PostgreSQL (обязателен в prod) |
