import { BaseMapper } from "@/common/mappers/base.mapper";
import { Gallery } from "./dto/gallery.dto";
import { Gallery as GalleryModel } from "./entities/gallery.entity";
import { GalleryItem as GalleryItemModel } from "./entities/gallery_item.entity";

export class GalleryMapper extends BaseMapper<GalleryModel, Gallery> {

  public entityToDto(entity: GalleryModel): Gallery {
    return {
      id: entity.uuid,
      slug: entity.slug,
      title: entity.title,
      description: entity.description,
      galleryItems: entity.items.map((item: GalleryItemModel) => {
        return {
          id: item.uuid,
          imageUrl: item.imageUrl,
          caption: item.caption,
        }
      }),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
}