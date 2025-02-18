import { BaseMapper } from "@/common/mappers/base.mapper";
import { Gallery } from "./dto/gallery.dto";
import { Gallery as GalleryModel } from "./entities/gallery.entity";
import { GalleryItem as GalleryItemModel } from "../gallery_item/entities/gallery_item.entity";
import { GalleryItemMapper } from "../gallery_item/gallery_item.mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GalleryMapper extends BaseMapper<GalleryModel, Gallery> {

  constructor(
    private readonly galleryItemMapper: GalleryItemMapper
  ) {
    super();
  }

  public entityToDto(entity: GalleryModel): Gallery {
    return {
      id: entity.uuid,
      slug: entity.slug,
      title: entity.title,
      description: entity.description,
      galleryItems: entity.items.map((item: GalleryItemModel) => {
        return this.galleryItemMapper.entityToDto(item);
      }),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}