import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { MediaService } from "./modules/media/media.service";

@Controller()
export class AppController {

  constructor(
    private readonly appService: AppService,
  ) {}

  @Get()
  index() {
    return 'Check this out! <a href="https://abdilla.my.id">abdilla.my.id</a>'
  }
}