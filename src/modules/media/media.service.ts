import { v4 as uuid } from 'uuid';

import { S3Service } from "@/s3/s3.service";
import { Inject, Injectable } from "@nestjs/common";
import { UnknownException } from '@/common/filters/exception.filter';
import { Media } from './entities/media.entity';
import * as moment from 'moment';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MediaService {

  constructor(
    private readonly config: ConfigService,
    private readonly s3Service: S3Service,
    @Inject(Media.name)
    private readonly mediaRepository: typeof Media,
  ) {}

  async upload(file: Express.Multer.File) {
    try {
      // return {
      //   url: await this.s3Service.upload('media', file.buffer, `${uuid()}.${file.mimetype.split('/')[1]}`, file.mimetype)
      // }
      const filename = `${uuid()}.${file.mimetype.split('/')[1]}`;
      const media = this.mediaRepository.build();
      media.name = filename;
      media.data = file.buffer;
      media.mimetype = file.mimetype;
      await media.save();
      return `${this.config.get<string>('SRC_DOMAIN')}/media/${filename}`;
    } catch (e) {
      console.error(e);
      throw new UnknownException();
    }
  }

  async serveFile(filename: string) {
    const media = await this.mediaRepository.findOne({
      where: {
        name: filename
      }
    });
    media.lastAccessAt = moment().format('YYYY-MM-DD HH:mm:ss');
    media.save();
    return {
      data: media.data,
      mimetype: media.mimetype
    };
  }
}