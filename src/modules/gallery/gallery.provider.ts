import { GalleryService } from "./gallery.service";
import { Gallery } from "./entities/gallery.entity";
import { GalleryItem } from "./entities/gallery_item.entity";

export const providers = [
  {
    provide: Gallery.name,
    useValue: Gallery
  },
  {
    provide: GalleryItem.name,
    useValue: GalleryItem
  },
  GalleryService,
]
