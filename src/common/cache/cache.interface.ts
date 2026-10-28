/**
 * Абстракция кэш-слоя.
 *
 * Текущая реализация — NullCacheService (no-op, без кэша).
 * Для production достаточно реализовать этот интерфейс через RedisCacheService
 * и подменить провайдер в CacheModule — бизнес-логика не изменится.
 *
 * Это точка роста, которую удобно продемонстрировать на интервью.
 */
export abstract class ICacheService {
  abstract get<T>(key: string): Promise<T | null>;
  abstract set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  abstract del(key: string): Promise<void>;
}
