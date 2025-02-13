import { Module } from "@nestjs/common";
import { GalleryController } from "./gallery.controller";
import { providers } from "./gallery.provider";
import { UserModule } from "../user/user.module";

@Module({
  imports: [UserModule],
  controllers: [GalleryController],
  providers: [...providers]
})
export class GalleryModule {}
