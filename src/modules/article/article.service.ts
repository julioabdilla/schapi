import { Inject, Injectable, Logger } from "@nestjs/common";
import { Article as ArticleModel } from "./entities/article.entity";
import { User as UserModel } from "../user/entities/user.entity";
import { Article } from "./dto/article.dto";
import { ArticleStatus } from "@/common/enums/article_status.enum";
import { DateUtils } from "@/shared/date";
import { ArticleMapper } from "./article.mapper";
import { UnknownException } from "@/common/filters/exception.filter";

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
      include: [
        {
          model: UserModel,
          as: 'creator',
        }
      ],
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
        },
        include: [
          {
            model: UserModel,
            as: 'creator',
          }
        ],
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

  async update(user: UserModel, id: string, data: Article) {
    try {
      const article = await this.articleRepository.findOne({
        where: {
          uuid: id
        }
      });
      if (!article) {
        throw new UnknownException();
      }
      article.title = data.title;
      article.content = data.content;
      article.status = data.status;
      article.tags = data.tags;
      if (data.status === ArticleStatus.PUBLISHED) {
        article.publishedAt = DateUtils.now().format();
        // article.createdBy = user.id;
      }
      await article.save();
      return this.articleMapper.entityToDto(article);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async delete(user: UserModel, id: string) {
    try {
      await this.articleRepository.destroy({
        where: {
          uuid: id
        }
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
