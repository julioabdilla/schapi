import { Inject, Injectable, Logger } from "@nestjs/common";
import { Gallery as GalleryModel } from "./entities/gallery.entity";
import { GalleryItem as GalleryItemModel} from "../gallery_item/entities/gallery_item.entity";
import { User as UserModel } from "../user/entities/user.entity";
import { Gallery } from "./dto/gallery.dto";
import { GalleryMapper } from "./gallery.mapper";
import { UnknownException } from "@/common/filters/exception.filter";
import { DateUtils } from "@/shared/date";
import { GalleryItem } from "../gallery_item/dto/gallery_item.dto";
import { GalleryItemMapper } from "../gallery_item/gallery_item.mapper";

@Injectable()
export class GalleryService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @Inject(GalleryModel.name)
    private readonly galleryRepository: typeof GalleryModel,
    private readonly galleryMapper: GalleryMapper,
    @Inject(GalleryItemModel.name)
    private readonly galleryItemRepository: typeof GalleryItemModel,
    private readonly galleryItemMapper: GalleryItemMapper,
  ) {}

  async getGallery(page: number, size: number, itemSize = 3): Promise<{total: number, data: Gallery[]}> {
    const {rows: galleries, count } = await this.galleryRepository.findAndCountAll({
      include: [
        {
          model: GalleryItemModel,
          order: [['id', 'DESC']],
          limit: itemSize
        }
      ],
      order: [['id', 'DESC']],
      offset: (page - 1) * size,
      limit: size,
    });
    return { total: count, data: this.galleryMapper.entitiesToDto(galleries) };
  }
  
  async addGallery(user: UserModel, data: Gallery) {
    const dbTransaction = await GalleryModel.getTransaction();
    try {

      const gallery = this.galleryRepository.build();
      gallery.title = data.title;
      gallery.description = data.description;
      gallery.createdBy = user.id;
      gallery.items = [];
      await gallery.save({ transaction: dbTransaction });
      
      await Promise.all(data.galleryItems.map(item => {
        return new Promise<void>(async resolve => {
          const galleryItem = this.galleryItemRepository.build();
          galleryItem.galleryId = gallery.id;
          galleryItem.imageUrl = item.imageUrl;
          galleryItem.caption = item.caption;
          galleryItem.createdBy = user.id;
          await galleryItem.save({ transaction: dbTransaction });
          gallery.items.push(galleryItem);
          resolve();
        });
      }));
      dbTransaction.commit();
      return this.galleryMapper.entityToDto(gallery);
    } catch (e) {
      this.logger.error(e);
      dbTransaction.rollback();
      throw e;
    }
  }

  async getGalleryDetail(id: string): Promise<Gallery> {
    return this.galleryMapper.entityToDto(await this.galleryRepository.findOne({
      where: {
        uuid: id
      },
      include: [
        {
          model: GalleryItemModel,
          order: [['id', 'DESC']],
        }
      ],
    }));
  }

  async editGallery(user: UserModel, id: string, data: Gallery): Promise<void> {
    const dbTransaction = await GalleryModel.getTransaction();
    try {
      const gallery = await this.galleryRepository.findOne({
        where: {
          uuid: id
        },
        transaction: dbTransaction
      });
      if (!gallery) {
        throw new UnknownException();
      }
      if (data.title) {
        gallery.title = data.title;
      }
      if (gallery.changed) {
        gallery.updatedAt = DateUtils.now().format();
        // gallery.updatedBy = user.id;
      }
      await gallery.save({ transaction: dbTransaction });
      await dbTransaction.commit();
    } catch(e) {
      this.logger.error(e);
      dbTransaction.rollback();
      throw e;
    }
  }

  async deleteGallery(user: UserModel, id: string): Promise<void> {
    try {
      await this.galleryRepository.destroy({
        where: {
          uuid: id,
        },
      });
    } catch(e) {
      this.logger.error(e);
      throw e;
    }
  }

  async addGalleryItem(user: UserModel, galleryId: string, data: GalleryItem) {
    try {
      const gallery = await this.galleryRepository.findOne({
        where: { uuid: galleryId }
      });
      if (!gallery) {
        throw new UnknownException();
      }
      const galleryItem = this.galleryItemRepository.build();
      galleryItem.galleryId = gallery.id;
      galleryItem.imageUrl = data.imageUrl;
      galleryItem.caption = data.caption;
      // galleryItem.createdBy = user.id;
      await galleryItem.save();
      return this.galleryItemMapper.entityToDto(galleryItem);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
