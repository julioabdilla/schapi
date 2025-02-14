import { Body, Controller, Get, Post, Query, Req, Res, UseGuards, UseInterceptors } from "@nestjs/common";
import { GalleryService } from "./gallery.service";
import { Gallery } from "./dto/gallery.dto";
import { Roles } from "@/common/decorators/role.decorator";
import { UserRole } from "@/common/enums/user_role.enum";
import { AuthGuard } from "@/common/guards/auth.guard";
import { UseResponseDto } from "@/common/decorators/response_dto.decorator";
import { ApiInterceptor } from "@/common/interceptors/response_interceptor";

@UseInterceptors(ApiInterceptor)
@Controller('/gallery')
export class GalleryController {

  constructor(
    private readonly galleryService: GalleryService
  ) {}

  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseResponseDto(Gallery)
  @Get()
  async getGallery(@Req() req: any, @Query('page') page: string = '1', @Query('perpage') pageSize: string = '10') {
    const gallery = await this.galleryService.getGallery(Number(page), Number(pageSize));
    req.pagination.page = Number(page);
    req.pagination.perpage = Number(pageSize);
    req.pagination.totalData = Number(gallery.total);
    return gallery.data;
  }

  @Get()
  async getGalleryItem(@Query('page') page: string = '1', @Query('size') size: string = '10') {
    return this.galleryService.getGalleryDetail(Number(page), Number(size));
  }

  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(AuthGuard)
  @Post()
  async addGallery(@Req() req: any, @Body() body: Gallery) {
    return this.galleryService.addGallery(req.user, body);
  }
}
