import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { providers } from "./auth.provider";

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [...providers]
})
export class AuthModule {}