import { Inject, Injectable, Logger } from "@nestjs/common";
import { Gallery as GalleryModel } from "./entities/gallery.entity";
import { GalleryItem, GalleryItem as GalleryItemModel} from "../gallery_item/entities/gallery_item.entity";
import { User } from "../user/entities/user.entity";
import { Gallery } from "./dto/gallery.dto";
import { GalleryMapper } from "./gallery.mapper";

@Injectable()
export class GalleryService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @Inject(GalleryModel.name)
    private readonly galleryRepository: typeof GalleryModel,
    @Inject(GalleryItemModel.name)
    private readonly galleryItemRepository: typeof GalleryItemModel,
    private readonly galleryMapper: GalleryMapper,
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
  
  async addGallery(user: User, data: Gallery) {
    const dbTransaction = await GalleryModel.getTransaction();
    try {

      const gallery = this.galleryRepository.build();
      gallery.title = data.title;
      gallery.description = data.description;
      gallery.createdBy = user.id;
      await gallery.save({ transaction: dbTransaction });
      
      await Promise.all(data.galleryItems.map(item => {
        return new Promise<void>(async resolve => {
          const galleryItem = this.galleryItemRepository.build();
          galleryItem.galleryId = gallery.id;
          galleryItem.imageUrl = item.imageUrl;
          galleryItem.caption = item.caption;
          galleryItem.createdBy = user.id;
          await galleryItem.save({ transaction: dbTransaction });
          resolve();
        });
      }));
      dbTransaction.commit();
    } catch (e) {
      this.logger.error(e);
      dbTransaction.rollback();
      throw e;
    }
  }
}
