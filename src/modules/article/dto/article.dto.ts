import { Expose, Type } from "class-transformer";
import { BaseDto } from "@/common/dto/base.dto";
import { ArticleStatus } from "@/common/enums/article_status.enum";

export class Article extends BaseDto {
  id: string;
  slug: string;
  title: string;
  content: string;
  status: ArticleStatus;
  tags: string[];
  @Expose({ name: 'published_at'})
  publishedAt: string;
  @Expose({ name: 'created_at'})
  createdAt: string;
  @Expose({ name: 'updated_at'})
  updatedAt: string;
  @Expose({ name: 'deleted_at'})
  deletedAt: string;
  @Expose({ name: 'created_by'})
  createdBy: string;
}
