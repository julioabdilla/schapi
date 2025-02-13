import { Expose, Type } from "class-transformer";
import { AddGalleryItem } from "./addGalleryItem.entity";

export class AddGallery {
  title: string;
  description: string;
  @Expose({ name: 'items' })
  @Type(() => AddGalleryItem)
  galleryItems: AddGalleryItem[];
}