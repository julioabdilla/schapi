import { RedisModule, RedisModuleOptions } from "@liaoliaots/nestjs-redis";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CacheService } from "./cache.service";

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: async (config: ConfigService): Promise<RedisModuleOptions> => {
        return {
          config: {
            url: `redis://:${config.get<string>('REDIS_PASSWORD')}@${config.get<string>('REDIS_HOST')}:${config.get<number>('REDIS_PORT')}/${config.get<string>('REDIS_SCHEME')}`
          },
        };
      },
    }),
  ],
  providers: [CacheService],
  exports: [CacheService]
})
export class CacheModule {}
