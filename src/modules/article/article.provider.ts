import { ArticleService } from "./article.service";
import { Article } from "./entities/article.entity";

export const providers = [
  {
    provide: Article.name,
    useValue: Article
  },
  ArticleService,
]
