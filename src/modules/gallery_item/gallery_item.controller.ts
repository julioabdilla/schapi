import { Controller, Delete, Get, Param, Patch, Query, Req, UseInterceptors } from "@nestjs/common";
import { GalleryItemService } from "./gallery_item.service";
import { UseResponseDto } from "@/common/decorators/response_dto.decorator";
import { GalleryItem } from "./dto/gallery_item.dto";
import { ApiInterceptor } from "@/common/interceptors/response.interceptor";
import { UserRole } from "@/common/enums/user_role.enum";
import { Roles } from "@/common/decorators/role.decorator";

@UseInterceptors(ApiInterceptor)
@Controller('/gallery_item')
export class GalleryItemController {

  constructor(
    private readonly galleryItemService: GalleryItemService,
  ) {}

  @UseResponseDto(GalleryItem)
  @Get()
  async getAll(@Req() req: any, @Query('page') page: string = '1', @Query('perpage') pageSize: string = '10') {
    const galleryItems = await this.galleryItemService.getAll(Number(page), Number(pageSize));
    req.pagination.page = Number(page);
    req.pagination.perpage = Number(pageSize);
    req.pagination.totalData = Number(galleryItems.total);
    return galleryItems.data;
  }

  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @Delete('/:id')
  async remove(@Req() req: any, @Param('id') id: string) {
    await this.galleryItemService.remove(req.user, id);
  }

  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @Patch('/:id/restore')
  async restore(@Req() req: any, @Param('id') id: string) {
    await this.galleryItemService.restore(req.user, id);
  }
}
