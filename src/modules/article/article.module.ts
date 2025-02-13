import { Module } from "@nestjs/common";
import { ArticleController } from "./article.controller";
import { providers } from "./article.provider";

@Module({
  imports: [],
  controllers: [ArticleController],
  providers: [...providers]
})
export class ArticleModule {}
