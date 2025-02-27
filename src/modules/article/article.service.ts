import { Inject, Injectable, Logger } from "@nestjs/common";
import { Article as ArticleModel } from "./entities/article.entity";
import { User as UserModel } from "../user/entities/user.entity";
import { Article } from "./dto/article.dto";
import { ArticleStatus } from "@/common/enums/article_status.enum";
import { DateUtils } from "@/shared/date";
import { ArticleMapper } from "./article.mapper";

@Injectable()
export class ArticleService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @Inject(ArticleModel.name)
    private readonly articleRepository: typeof ArticleModel,
    private readonly articleMapper: ArticleMapper,
  ) {}
  
  async getAll(page: number, size: number, status: ArticleStatus = null, sort = 'id.desc'): Promise<{total: number, data: Article[]}> {
    let where: any;
    if (status) {
      where = { status };
    }
    const {rows: articles, count } = await this.articleRepository.findAndCountAll({
      where,
      order: sort.split(',').map(sort => sort.split('.')) as any,
      offset: (page - 1) * size,
      limit: size,
    });
    return { total: count, data: this.articleMapper.entitiesToDto(articles) };
  }

  async getDetail(id: string) {
    try {
      const article = await this.articleRepository.findOne({
        where: {
          uuid: id
        }
      });
      return this.articleMapper.entityToDto(article);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async create(user: UserModel, data: Article) {
    try {
      const article = this.articleRepository.build();
      article.title = data.title;
      article.content = data.content;
      article.status = data.status;
      article.tags = data.tags;
      if (data.status === ArticleStatus.PUBLISHED) {
        article.publishedAt = DateUtils.now().format();
      }
      await article.save();
      return this.articleMapper.entityToDto(article);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
