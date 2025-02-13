import { Expose } from "class-transformer";

export class AddGalleryItem {
  @Expose({ name: 'image_url' })
  imageUrl: string;
  caption: string;
}
