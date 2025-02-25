import { Inject, Injectable, Logger } from "@nestjs/common";
import { GalleryItem as GalleryItemModel } from "./entities/gallery_item.entity";
import { GalleryItemMapper } from "./gallery_item.mapper";
import { Gallery as GalleryModel } from "../gallery/entities/gallery.entity";
import { User as UserModel } from "../user/entities/user.entity";

@Injectable()
export class GalleryItemService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @Inject(GalleryItemModel.name)
    private readonly galleryItemRepository: typeof GalleryItemModel,
    private readonly galleryItemMapper: GalleryItemMapper,
  ) {}

  async getAll(page?: number, size?: number) {
    try {
      const {rows: galleryItem, count } = await this.galleryItemRepository.findAndCountAll({
        include: [
          {
            model: GalleryModel,
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
            model: GalleryModel,
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

  async remove(user: UserModel, id: string) {
    try {
      await this.galleryItemRepository.destroy({
        where: {
          uuid: id
        }
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async restore(user: UserModel, id: string) {
    try {
      await this.galleryItemRepository.restore({
        where: {
          uuid: id
        }
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}