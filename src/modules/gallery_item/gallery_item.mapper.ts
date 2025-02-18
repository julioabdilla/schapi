import { BaseMapper } from "@/common/mappers/base.mapper";
import { GalleryItem as GalleryItemModel } from "./entities/gallery_item.entity";
import { GalleryItem } from "./dto/gallery_item.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GalleryItemMapper extends BaseMapper<GalleryItemModel, GalleryItem> {

  public entityToDto(entity: GalleryItemModel): GalleryItem {
    return {
      id: entity.uuid,
      imageUrl: entity.imageUrl,
      caption: entity.caption,
    };
  }
}