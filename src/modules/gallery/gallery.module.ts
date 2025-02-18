import { forwardRef, Module } from "@nestjs/common";
import { GalleryController } from "./gallery.controller";
import { providers } from "./gallery.provider";
import { UserModule } from "../user/user.module";
import { GalleryItemModule } from "../gallery_item/gallery_item.module";

@Module({
  imports: [
    UserModule,
    forwardRef(() => GalleryItemModule)
  ],
  controllers: [GalleryController],
  providers: [...providers]
})
export class GalleryModule {}
