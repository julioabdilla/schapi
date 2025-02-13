import { Inject, Injectable } from "@nestjs/common";
import { Article } from "./entities/article.entity";

@Injectable()
export class ArticleService {

  constructor(
    @Inject(Article.name)
    private readonly articleRepository: typeof Article,
  ) {}
}
