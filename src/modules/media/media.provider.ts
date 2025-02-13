import { Media } from "./entities/media.entity";
import { MediaService } from "./media.service";

export const providers = [
  {
    provide: Media.name,
    useValue: Media
  },
  MediaService
]
