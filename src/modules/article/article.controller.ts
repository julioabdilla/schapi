import { Body, Controller, Get, Patch, Param, Post, Query, Req, UseGuards, UseInterceptors, Delete } from "@nestjs/common";
import { ArticleService } from "./article.service";
import { UseResponseDto } from "@/common/decorators/response_dto.decorator";
import { Article } from "./dto/article.dto";
import { Roles } from "@/common/decorators/role.decorator";
import { UserRole } from "@/common/enums/user_role.enum";
import { AuthGuard } from "@/common/guards/auth.guard";
import { ArticleStatus } from "@/common/enums/article_status.enum";
import { JsonLimitInterceptor } from "@/common/interceptors/json_limit.interceptor";
import { ApiInterceptor } from "@/common/interceptors/response.interceptor";
import { UnknownException } from "@/common/filters/exception.filter";

@UseInterceptors(ApiInterceptor)
@Controller('/article')
export class ArticleController {
  
  constructor(
    private readonly articleService: ArticleService
  ) {}

  @UseResponseDto(Article)
  @Get()
  async getAll(@Req() req: any, @Query('page') page: string = '1', @Query('perpage') pageSize: string = '10', @Query('status') status: ArticleStatus, @Query('sort') sort: string) {
    const articles = await this.articleService.getAll(Number(page), Number(pageSize), status, sort);
    req.pagination.page = Number(page);
    req.pagination.perpage = Number(pageSize);
    req.pagination.totalData = Number(articles.total);
    return articles.data;
  }

  @UseResponseDto(Article)
  @Get('/published')
  async getPublished(@Req() req: any, @Query('page') page: string = '1', @Query('perpage') pageSize: string = '10', @Query('sort') sort: string) {
    const articles = await this.articleService.getAll(Number(page), Number(pageSize), ArticleStatus.PUBLISHED, sort);
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

  @UseInterceptors(JsonLimitInterceptor)
  @UseResponseDto(Article)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(AuthGuard)
  @Patch('/:id')
  updateArticle(@Req() req: any, @Param('id') id: string, @Body() body: Article) {
    return this.articleService.update(req.user, id, body);
  }

  @UseInterceptors(JsonLimitInterceptor)
  @UseResponseDto(Article)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(AuthGuard)
  @Delete('/:id')
  deleteArticle(@Req() req: any, @Param('id') id: string, @Body() body: Article) {
    return this.articleService.delete(req.user, id);
  }

  @UseInterceptors(JsonLimitInterceptor)
  @UseResponseDto(Article)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(AuthGuard)
  @Patch('/:id/draft')
  draftArticle(@Req() req: any, @Param('id') id: string, @Body() body: Article) {
    body.status = ArticleStatus.DRAFT;
    return this.articleService.update(req.user, id, body);
  }

  @UseInterceptors(JsonLimitInterceptor)
  @UseResponseDto(Article)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(AuthGuard)
  @Patch('/:id/publish')
  publishArticle(@Req() req: any, @Param('id') id: string, @Body() body: Article) {
    body.status = ArticleStatus.PUBLISHED;
    return this.articleService.update(req.user, id, body);
  }

  @UseInterceptors(JsonLimitInterceptor)
  @UseResponseDto(Article)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(AuthGuard)
  @Patch('/:id/archive')
  arcihiveArticle(@Req() req: any, @Param('id') id: string, @Body() body: Article) {
    body.status = ArticleStatus.ARCHIVED;
    return this.articleService.update(req.user, id, body);
  }
}
