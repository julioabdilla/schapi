import { Body, Controller, Get, Logger, Param, Post, Query, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { ArticleService } from "./article.service";
import { UseResponseDto } from "@/common/decorators/response_dto.decorator";
import { Article } from "./dto/article.dto";
import { Roles } from "@/common/decorators/role.decorator";
import { UserRole } from "@/common/enums/user_role.enum";
import { AuthGuard } from "@/common/guards/auth.guard";
import { ArticleStatus } from "@/common/enums/article_status.enum";
import { JsonLimitInterceptor } from "@/common/interceptors/json_limit.interceptor";

@Controller('/article')
export class ArticleController {
  
  constructor(
    private readonly articleService: ArticleService
  ) {}

  @UseResponseDto(Article)
  @Get()
  async getAll(@Req() req: any, @Query('page') page: string = '1', @Query('perpage') pageSize: string = '10') {
    const articles = await this.articleService.getAll(Number(page), Number(pageSize));
    req.pagination.page = Number(page);
    req.pagination.perpage = Number(pageSize);
    req.pagination.totalData = Number(articles.total);
    return articles.data;
  }

  @UseInterceptors(JsonLimitInterceptor)
  @UseResponseDto(Article)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(AuthGuard)
  @Post()
  create(@Req() req: any, @Body() body: Article) {
    return this.articleService.create(req.user, body);
  }

  @UseInterceptors(JsonLimitInterceptor)
  @UseResponseDto(Article)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(AuthGuard)
  @Post('/draft')
  draft(@Req() req: any, @Body() body: Article) {
    body.status = ArticleStatus.DRAFT;
    return this.articleService.create(req.user, body);
  }

  @UseInterceptors(JsonLimitInterceptor)
  @UseResponseDto(Article)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(AuthGuard)
  @Post('/publish')
  publish(@Req() req: any, @Body() body: Article) {
    body.status = ArticleStatus.PUBLISHED;
    return this.articleService.create(req.user, body);
  }

  @UseResponseDto(Article)
  @Get('/:id')
  async getDetail(@Param('id') id: string) {
    return this.articleService.getDetail(id);
  }
}
