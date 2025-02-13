import { Inject, Injectable, Logger } from "@nestjs/common";
import { Gallery } from "./entities/gallery.entity";
import { GalleryItem } from "./entities/gallery_item.entity";
import { User } from "../user/entities/user.entity";
import { AddGallery } from "./dtos/addGallery.entity";

@Injectable()
export class GalleryService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @Inject(Gallery.name)
    private readonly galleryRepository: typeof Gallery,
    @Inject(GalleryItem.name)
    private readonly galleryItemRepository: typeof GalleryItem,
  ) {}

  async getGallery(page = 0, size = 10, itemSize = 3) {
    const galleries = await this.galleryRepository.findAll({
      include: [
        {
          model: GalleryItem,
          order: [['id', 'DESC']],
          limit: itemSize
        }
      ],
      order: [['id', 'DESC']],
      offset: (page - 1) * size,
      limit: size,
    });
    return galleries;
  }

  async getGalleryDetail(page = 0, size = 10) {
    const galleryItems = await this.galleryItemRepository.findAll({
      order: [['id', 'DESC']],
      offset: (page - 1) * size,
      limit: size,
    });
    return galleryItems;
  }
  
  async addGallery(user: User, data: AddGallery) {
    const dbTransaction = await Gallery.getTransaction();
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
