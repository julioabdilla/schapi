import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, Res, UseGuards, UseInterceptors } from "@nestjs/common";
import { GalleryService } from "./gallery.service";
import { Gallery } from "./dto/gallery.dto";
import { Roles } from "@/common/decorators/role.decorator";
import { UserRole } from "@/common/enums/user_role.enum";
import { AuthGuard } from "@/common/guards/auth.guard";
import { UseResponseDto } from "@/common/decorators/response_dto.decorator";
import { ApiInterceptor } from "@/common/interceptors/response.interceptor";
import { GalleryItemService } from "../gallery_item/gallery_item.service";
import { GalleryItem } from "../gallery_item/dto/gallery_item.dto";

@UseInterceptors(ApiInterceptor)
@Controller('/gallery')
export class GalleryController {

  constructor(
    private readonly galleryService: GalleryService,
    private readonly galleryItemService: GalleryItemService,
  ) {}

  @UseResponseDto(Gallery)
  @Get()
  async getGallery(@Req() req: any, @Query('page') page: string = '1', @Query('perpage') pageSize: string = '10', @Query('item') itemSize: string = '2') {
    const gallery = await this.galleryService.getGallery(Number(page), Number(pageSize), Number(itemSize));
    req.pagination.page = Number(page);
    req.pagination.perpage = Number(pageSize);
    req.pagination.totalData = Number(gallery.total);
    return gallery.data;
  }

  @UseResponseDto(Gallery)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(AuthGuard)
  @Post()
  async addGallery(@Req() req: any, @Body() body: Gallery) {
    return this.galleryService.addGallery(req.user, body);
  }

  @UseResponseDto(Gallery)
  @UseResponseDto(GalleryItem)
  @Get('/:id')
  async getGalleryDetail(@Param('id') id: string) {
    return this.galleryService.getGalleryDetail(id);
  }

  @UseResponseDto(Gallery)
  @UseResponseDto(GalleryItem)
  @Get('/:id/item')
  async getGalleryItem(@Req() req: any, @Param('id') id: string, @Query('page') page: string = '1', @Query('perpage') pageSize: string = '10') {
    const galleryItem = await this.galleryItemService.getByGallery(id, Number(page), Number(pageSize));
    req.pagination.page = Number(page);
    req.pagination.perpage = Number(pageSize);
    req.pagination.totalData = Number(galleryItem.total);
    return galleryItem.data;
  }

  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @Patch('/:id')
  async editGallery(@Req() req: any, @Param('id') id: string, @Body() body: Gallery) {
    await this.galleryService.editGallery(req.user, id, body);
  }

  @UseResponseDto(GalleryItem)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @Put('/:id/item')
  async addGalleryItem(@Req() req: any, @Param('id') id: string, @Body() body: GalleryItem) {
    return await this.galleryService.addGalleryItem(req.user, id, body);
  }
}
