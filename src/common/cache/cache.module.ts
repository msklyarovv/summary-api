import { Global, Module } from '@nestjs/common';
import { ICacheService } from './cache.interface';
import { NullCacheService } from './null-cache.service';

@Global()
@Module({
  providers: [{ provide: ICacheService, useClass: NullCacheService }],
  exports: [ICacheService],
})
export class CacheModule {}
