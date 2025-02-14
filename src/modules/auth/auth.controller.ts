import { Body, Controller, Headers, Post, Query, UseInterceptors } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { GetToken, GetTokenResponse } from "./dto/get_token.dto";
import { ApiInterceptor } from "@/common/interceptors/response_interceptor";
import { UseResponseDto } from "@/common/decorators/response_dto.decorator";
import { Roles } from "@/common/decorators/role.decorator";
import { UserRole } from "@/common/enums/user_role.enum";

@UseInterceptors(ApiInterceptor)
@Controller('/auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ) {}

  @Roles(UserRole.SUPERUSER, UserRole.ADMIN, UserRole.STAFF)
  @UseResponseDto(GetTokenResponse)
  @Post('/token')
  async getToken(@Headers('authorization') auth: string, @Body() body: GetToken, @Query() query: GetToken) {
    return this.authService.getToken(auth, {...body, ...query});
  }
}