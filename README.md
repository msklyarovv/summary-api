# summary-api

Скляров Михаил Олегович
Резюме в виде API — GraphQL API на NestJS + Prisma + PostgreSQL + Docker.

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

## Обновление приложения

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

### ICacheService

Абстракция кэш-слоя готова в `src/common/cache/`.
Текущая реализация: `NullCacheService` (no-op).

Можно заиспользовать Redis

### ProfileStats

`profileStats` query возвращает счётчик просмотров.
Хранится в памяти → сбрасывается при рестарте, СЕЙЧАС - не масштабируется горизонтально.

Можно добавить тот же `ICacheService` с Redis.
Дополнительно, добавить аналитику по времени суток, уникальных посетителей (по IP).

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
