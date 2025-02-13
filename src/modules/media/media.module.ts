import { S3Module } from "@/s3/s3.module";
import { Module } from "@nestjs/common";
import { MediaController } from "./media.controller";
import { providers } from "./media.provider";
import { UserModule } from "../user/user.module";

@Module({
  imports: [UserModule, S3Module],
  controllers: [MediaController],
  providers: [...providers],
  exports: [...providers]
})
export class MediaModule {}