import { Injectable } from '@nestjs/common';
import { ICacheService } from './cache.interface';

/**
 * No-op реализация кэш-слоя.
 * Не кэширует ничего — прозрачна для бизнес-логики.
 * Заменяется на RedisCacheService без изменения кода потребителей.
 */
@Injectable()
export class NullCacheService implements ICacheService {
  get<T>(_key: string): Promise<T | null> {
    return Promise.resolve(null);
  }

  set<T>(_key: string, _value: T, _ttlSeconds?: number): Promise<void> {
    return Promise.resolve();
  }

  del(_key: string): Promise<void> {
    return Promise.resolve();
  }
}
