# summary-api

Цифровая визитка Михаила Склярова — GraphQL API на NestJS + Prisma + PostgreSQL + Docker.

## Быстрый старт

```bash
# Запустить всё одной командой (PostgreSQL + API + seed)
docker-compose up --build
```

После запуска Apollo Sandbox доступен по адресу: **http://localhost:3000/graphql**

### Локальная разработка

```bash
# 1. Поднять только БД
docker-compose -f docker-compose.dev.yml up -d

# 2. Установить зависимости
npm install

# 3. Применить миграции и заполнить БД
npx prisma migrate dev
npx ts-node prisma/seed.ts

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
    links {
      label
      url
    }
    skills {
      name
      category
    }
    experience {
      company
      position
      startDate
      endDate
      achievements
      stack
    }
    projects {
      name
      description
      url
    }
  }
}
```

**Только Frontend-навыки:**
```graphql
query {
  profile {
    name
    skills(category: "Frontend") {
      name
    }
  }
}
```

**Только опыт и проекты:**
```graphql
query {
  profile {
    experience {
      company
      position
      startDate
    }
    projects {
      name
      url
    }
  }
}
```

---

## Архитектурные решения

### Code First GraphQL

TypeScript-классы с декораторами `@ObjectType` / `@Field` — единственный источник правды.
Схема генерируется из кода автоматически (`autoSchemaFile: true`).

**Альтернатива:** Schema First (SDL-файлы) — даёт больший контроль над схемой, но требует синхронизировать SDL и TypeScript вручную. Для личного проекта с одной командой Code First проще в поддержке.

### Оптимизация запросов: DataLoader

Все связанные данные (skills, experience, projects) загружаются через **DataLoader** (`Scope.REQUEST`).

**Проблема без DataLoader (N+1):**
```
SELECT * FROM profiles;           -- 1 запрос
SELECT * FROM skills WHERE profileId = 'a';  -- ещё 1 на каждый профиль
SELECT * FROM skills WHERE profileId = 'b';
SELECT * FROM skills WHERE profileId = 'c';
-- Итого: 1 + N запросов
```

**С DataLoader:**
```
SELECT * FROM profiles;                         -- 1 запрос
SELECT * FROM skills WHERE profileId IN (a,b,c); -- 1 батч-запрос
-- Итого: 2 запроса независимо от количества профилей
```

DataLoader-ы инициализируются per-request (`Scope.REQUEST`) — каждый GraphQL-запрос получает чистый экземпляр без утечки кэша между пользователями.

### Кэш-слой: ICacheService

Введена абстракция `ICacheService` с no-op реализацией `NullCacheService`.

**Точка роста:** реализовать `RedisCacheService` и подменить провайдер в `CacheModule`.
Бизнес-логика и сервисы не изменятся — только конфигурация DI.

```
CacheModule
  providers: [{ provide: ICacheService, useClass: RedisCacheService }]
```

Это позволило бы кэшировать результат `profile()` с TTL ~60 секунд и снять нагрузку с БД при высоком трафике.

### Защита GraphQL API

**ComplexityPlugin** — ограничивает «стоимость» запроса.
Настраивается через `GRAPHQL_MAX_COMPLEXITY` (по умолчанию 50).

**Точка роста:** разные бюджеты для разных клиентов / API-ключей. Можно логировать сложность в Grafana для анализа трендов.

**ThrottlerModule** — rate limiting на уровне HTTP (запросов/минуту с одного IP).

**Helmet** — security headers: XSS protection, HSTS, referrer policy и т.д.

### Инициализация БД

При каждом старте `SeedService` (через `OnApplicationBootstrap`) проверяет наличие данных и заполняет БД, если она пустая. Реализован через `upsert` — идемпотентен, безопасно перезапускать.

В Docker entrypoint сначала выполняются миграции (`prisma migrate deploy`), затем стартует приложение, которое само делает seed.

**Альтернатива:** вынести seed в отдельный CLI-скрипт (`prisma db seed`) — даёт операторам явный контроль, но усложняет Docker-сетап.

### Разделение ответственности

```
Resolver     — GraphQL-интерфейс: парсинг аргументов, маппинг в GraphQL-типы
Service      — бизнес-логика и работа с БД (через Prisma)
Loader       — батчинг и кэширование DB-запросов (DataLoader)
PrismaModule — глобальный singleton PrismaClient
CacheModule  — глобальная абстракция кэша
```

### Структура проекта

```
src/
├── config/          # Конфигурация приложения (ConfigModule)
├── prisma/          # PrismaService (глобальный)
├── common/
│   ├── scalars/     # Кастомный DateTime scalar
│   ├── plugins/     # ComplexityPlugin
│   └── cache/       # ICacheService + NullCacheService
├── profile/         # Профиль: resolver, service, types
├── skill/           # Навыки: service, loader, types
├── experience/      # Опыт: service, loader, types
├── project/         # Проекты: service, loader, types
└── seed/            # Автозаполнение БД при старте
prisma/
├── schema.prisma    # Схема БД
└── seed.ts          # CLI-seed (альтернатива SeedService)
docker/
└── entrypoint.sh    # migrate → start
```

---

## Переменные окружения

| Переменная | По умолчанию | Описание |
|---|---|---|
| `DATABASE_URL` | — | PostgreSQL connection string |
| `NODE_ENV` | `development` | Режим работы |
| `PORT` | `3000` | HTTP-порт |
| `GRAPHQL_INTROSPECTION` | `true` | Включить introspection |
| `GRAPHQL_MAX_COMPLEXITY` | `50` | Лимит сложности запроса |
| `THROTTLE_TTL` | `60000` | Окно rate limit (мс) |
| `THROTTLE_LIMIT` | `100` | Макс. запросов за окно |

---

## Технологии

| Технология | Версия | Роль |
|---|---|---|
| Node.js | 20 LTS | Runtime |
| TypeScript | 5.x | Типизация |
| NestJS | 10.x | Фреймворк |
| GraphQL + Apollo Server | 16.x / 4.x | API |
| Prisma | 5.x | ORM + миграции |
| PostgreSQL | 16 | База данных |
| DataLoader | 2.x | Батчинг DB-запросов |
| Docker | — | Контейнеризация |
| Helmet | 8.x | HTTP security headers |
| NestJS Throttler | 6.x | Rate limiting |
