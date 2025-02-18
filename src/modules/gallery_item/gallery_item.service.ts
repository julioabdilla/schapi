import { Inject, Injectable, Logger } from "@nestjs/common";
import { GalleryItem } from "./entities/gallery_item.entity";
import { GalleryItemMapper } from "./gallery_item.mapper";
import { Gallery } from "../gallery/entities/gallery.entity";

@Injectable()
export class GalleryItemService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @Inject(GalleryItem.name)
    private readonly galleryItemRepository: typeof GalleryItem,
    private readonly galleryItemMapper: GalleryItemMapper,
  ) {}

  async getAll(page?: number, size?: number) {
    try {
      const {rows: galleryItem, count } = await this.galleryItemRepository.findAndCountAll({
        include: [
          {
            model: Gallery,
            required: true,
          }
        ],
        offset: (page - 1) * size,
        limit: size,
        order: [['id', 'DESC']]
      });
      return { total: count, data: this.galleryItemMapper.entitiesToDto(galleryItem) };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async getByGallery(galleryId: string, page?: number, size?: number) {
    try {
      const { rows: galleryItem, count } = await this.galleryItemRepository.findAndCountAll({
        where: {
          '$gallery.uuid$': galleryId
        },
        include: [
          {
            model: Gallery,
            required: true,
          }
        ],
        offset: (page - 1) * size,
        limit: size,
        order: [['id', 'DESC']]
      });
      return { total: count, data: this.galleryItemMapper.entitiesToDto(galleryItem)};
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}