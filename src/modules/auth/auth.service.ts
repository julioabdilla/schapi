import * as moment from 'moment';

import { Inject, Injectable, Logger } from "@nestjs/common";
import { User } from "../user/entities/user.entity";
import { AuthException, UnknownException } from '@/common/filters/exception.filter';
import { ConfigService } from '@nestjs/config';
import { JWT, Scrypt } from '@/shared/crypto';
import { GetToken } from './dto/get_token.dto';
import { Role } from '../user/entities/role.entity';
import { Permission } from '../user/entities/permission.entity';
import { CacheService } from '@/cache/cache.service';
import { AuthGuard } from '@/common/guards/auth.guard';
import { UserRole } from '@/common/enums/user_role.enum';
import { permission } from 'process';

@Injectable()
export class AuthService {

  private logger = new Logger(this.constructor.name);

  constructor(
    private readonly config: ConfigService,
    private readonly cacheService: CacheService,
    @Inject(User.name)
    private readonly userRepository: typeof User,
    @Inject(Permission.name)
    private readonly permissionRepository: typeof Permission,
  ) {}

  async getToken(auth: string, data: GetToken) {
    try {
      const now = moment();

      const [,token] = auth.split(' ');
      const [username, password] = Buffer.from(token, 'base64').toString().split(':'); 
      const user = await this.userRepository.findOne({
        where: {
          username
        },
        include: [
          {
            model: Role,
            include: [
              {
                model: Permission
              }
            ]
          },
          {
            model: Permission
          }
        ]
      });
      if (!user) {
        throw new AuthException();
      }
      if (!await Scrypt.compare(password, user.password, this.config.get<string>('PASS_SALT'))) {
        throw new AuthException();
      }

      if ([UserRole.SUPERUSER, UserRole.ADMIN].includes(user.role.name)) {
        const allPermissions = await this.permissionRepository.findAll();
        user.additionalPermissions = allPermissions;
      }
      const accessTokenExp = now.clone().add(3, 'hours');
      const accessTokenExpIn = accessTokenExp.diff(now, 'seconds');
      const accessToken = JWT.encode({
        iat: now.clone().unix(),
        exp: accessTokenExp.clone().unix(),
        sub: user.uuid,
        typ: user.role.name,
        prm: [...new Set([...user.role.permissions.map(permission => permission.name), ...user.additionalPermissions.map(permission => permission.name)])],
      }, this.config.get<string>('JWT_SECRET'));

      await this.cacheService.set(`${AuthGuard.TOKEN_CACHE_PREFIX}${accessToken}`, `${user.id}`, accessTokenExpIn);

      return {
        username: user.username,
        name: user.name,
        role: user.role.name,
        token: accessToken,
        expiresAt: accessTokenExp.format(),
      };
    } catch(e) {
      console.error(e);
      throw new UnknownException();
    }
  }
}