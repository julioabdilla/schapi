import { Expose, Type } from "class-transformer";
import { GalleryItem } from "@/modules/gallery_item/dto/gallery_item.dto";
import { BaseDto } from "@/common/dto/base.dto";

export class Gallery extends BaseDto {
  id: string;
  slug: string;
  title: string;
  description: string;
  @Expose({ name: 'items' })
  @Type(() => GalleryItem)
  galleryItems: GalleryItem[];
  @Expose({ name: 'created_at'})
  createdAt: string;
  @Expose({ name: 'updated_at'})
  updatedAt: string;
  @Expose({ name: 'deleted_at'})
  deletedAt: string;
}