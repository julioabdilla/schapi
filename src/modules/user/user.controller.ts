import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUser } from "./dto/create_user.dto";
import { AuthGuard } from "@/common/guards/auth.guard";
import { Roles } from "@/common/decorators/role.decorator";
import { UserRole } from "@/common/enums/user_role.enum";
import { Permissions } from "@/common/decorators/permission.decorator";

@Permissions('user')
@Controller('/user')
export class UserController {
  
  constructor(
    private readonly userService: UserService,
  ) {}

  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard)
  @Post()
  async createUser(@Body() body: CreateUser) {
    return this.userService.createUser(body);
  }
}
