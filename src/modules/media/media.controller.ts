import { memoryStorage } from 'multer';
import { Express } from 'express';
import { Controller, Get, Param, Post, Put, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from "./media.service";
import { AuthGuard } from '@/common/guards/auth.guard';
import { Roles } from '@/common/decorators/role.decorator';
import { UserRole } from '@/common/enums/user_role.enum';
import { FileTooLarge } from '@/common/filters/exception.filter';

@Controller('/media')
export class MediaController {

  constructor(
    private readonly mediaService: MediaService
  ) {}

  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(AuthGuard)
  @Put('/upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    limits: { fileSize: (128 * 1024) }
  }))
  async upload(@UploadedFile() file: Express.Multer.File) {
    return await this.mediaService.upload(file);
  }

  @Get('/:filename')
  async serveFile(@Param('filename') filename: string, @Res() res: any) {
    const { data, mimetype } = await this.mediaService.serveFile(filename);
    res.contentType(mimetype);
    res.send(data);
  }
}