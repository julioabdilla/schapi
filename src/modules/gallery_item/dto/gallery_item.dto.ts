import { BaseDto } from "@/common/dto/base.dto";
import { Expose } from "class-transformer";

export class GalleryItem extends BaseDto {
  id: string;
  @Expose({ name: 'image_url' })
  imageUrl: string;
  caption: string;
}
