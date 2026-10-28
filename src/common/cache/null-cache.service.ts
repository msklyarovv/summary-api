import { Injectable } from '@nestjs/common';
import { ICacheService } from './cache.interface';

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
