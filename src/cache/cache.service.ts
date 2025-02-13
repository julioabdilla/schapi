import { RedisService } from "@liaoliaots/nestjs-redis";
import { Injectable } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class CacheService {
  private readonly redisClient: Redis;

  constructor(
    private readonly redisService: RedisService
  ) {
    this.redisClient = this.redisService.getOrThrow();
  }

  async set(key: string, value: string, expireTime?: number): Promise<void> {
    await this.redisClient.set(key, value);
    if (expireTime) {
      await this.redisClient.expire(key, expireTime);
    }
  }

  async expire(key: string, expireTime: number): Promise<void> {
    await this.redisClient.expire(key, expireTime);
  }

  async get(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  async delete(key: string): Promise<number> {
    return await this.redisClient.del(key);
  }
}
