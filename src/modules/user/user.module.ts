import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { providers } from "./user.provider";
import { CacheModule } from "@/cache";

@Module({
  imports: [CacheModule],
  controllers: [UserController],
  providers: [...providers],
  exports: [...providers, CacheModule]
})
export class UserModule {}
