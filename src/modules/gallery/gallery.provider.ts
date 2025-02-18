import { GalleryService } from "./gallery.service";
import { Gallery } from "./entities/gallery.entity";
import { GalleryMapper } from "./gallery.mapper";

export const providers = [
  {
    provide: Gallery.name,
    useValue: Gallery
  },
  GalleryService,
  GalleryMapper,
]
