import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { GalleryService } from "./gallery.service";
import { AddGallery } from "./dtos/addGallery.entity";
import { Roles } from "@/common/decorators/role.decorator";
import { UserRole } from "@/common/enums/user_role.enum";
import { AuthGuard } from "@/common/guards/auth.guard";

@Controller('/gallery')
export class GalleryController {

  constructor(
    private readonly galleryService: GalleryService
  ) {}

  @Get()
  async getGallery(@Query('page') page: number, @Query('size') size: number) {
    return this.galleryService.getGallery(Number(page), Number(size));
  }

  @Get()
  async getGalleryItem(@Query('page') page: number, @Query('size') size: number) {
    return this.galleryService.getGalleryDetail(Number(page), Number(size));
  }

  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(AuthGuard)
  @Post()
  async addGallery(@Req() req: any, @Body() body: AddGallery) {
    return this.galleryService.addGallery(req.user, body);
  }
}
