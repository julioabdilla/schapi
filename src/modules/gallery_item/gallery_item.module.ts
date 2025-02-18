import { forwardRef, Module } from "@nestjs/common";
import { GalleryModule } from "../gallery/gallery.module";
import { GalleryItemController } from "./gallery_item.controller";
import { providers } from "./gallery_item_provider";

@Module({
  imports: [
    forwardRef(() => GalleryModule)
  ],
  controllers: [GalleryItemController],
  providers: [...providers],
  exports: [...providers]
})
export class GalleryItemModule {}