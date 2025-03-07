import { BaseMapper } from "@/common/mappers/base.mapper";
import { Injectable } from "@nestjs/common";
import { Article as ArticleModel } from "./entities/article.entity";
import { Article } from "./dto/article.dto";

@Injectable()
export class ArticleMapper extends BaseMapper<ArticleModel, Article> {

  public entityToDto(entity: ArticleModel): Article {
    return {
      id: entity.uuid,
      slug: entity.slug,
      title: entity.title,
      content: entity.content,
      status: entity.status,
      tags: entity.tags,
      publishedAt: entity.publishedAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
      createdBy: entity.creator?.name || null
    };
  }
}