import { Module } from "@nestjs/common";
import { ArticleController } from "./article.controller";
import { providers } from "./article.provider";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    UserModule
  ],
  controllers: [ArticleController],
  providers: [...providers]
})
export class ArticleModule {}
