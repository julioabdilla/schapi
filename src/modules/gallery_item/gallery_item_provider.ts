import { GalleryItem } from "./entities/gallery_item.entity";
import { GalleryItemMapper } from "./gallery_item.mapper";
import { GalleryItemService } from "./gallery_item.service";

export const providers = [
  {
    provide: GalleryItem.name,
    useValue: GalleryItem
  },
  GalleryItemService,
  GalleryItemMapper
]