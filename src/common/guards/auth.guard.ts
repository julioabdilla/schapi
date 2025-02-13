import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';

import { User } from '@/modules/user/entities/user.entity';
import Redis from 'ioredis';
import { Reflector } from '@nestjs/core';
import { Permission } from '@/modules/user/entities/permission.entity';
import { AuthException, BaseHttpException, UnknownException } from '../filters/exception.filter';
import { JWT } from '@/shared/crypto';
import { Role } from '@/modules/user/entities/role.entity';
import { UserRole } from '../enums/user_role.enum';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '@/cache/cache.service';
import * as moment from 'moment';

@Injectable()
export class AuthGuard implements CanActivate {
  public static TOKEN_CACHE_PREFIX = `access_token:`;

  private logger = new Logger(this.constructor.name);

  constructor(
    private readonly config: ConfigService,
    @Inject(User.name)
    private readonly userRepository: typeof User,
    private readonly cacheService: CacheService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const permissions: string[] = this.reflector.getAllAndOverride<string[]>('permissions', [
        context.getHandler(),
        context.getClass(),
      ]);
      const roles: UserRole[] = this.reflector.getAllAndOverride<UserRole[]>('roles', [
        context.getHandler(),
        context.getClass(),
      ]);
      const req = context.switchToHttp().getRequest();
      let [,token] = req.headers['authorization']?.split(' ') ?? [];
      if (!token) {
        throw new AuthException();
      }
      const userId = await this.cacheService.get(`${AuthGuard.TOKEN_CACHE_PREFIX}${token}`);
      if (!userId) {
        throw new AuthException();
      }
      let { sub } = JWT.decode(token, this.config.get<string>('JWT_SECRET'));
      const user = await this.userRepository.findOne({
        where: { 
          id: userId,
          uuid: sub
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
            model: Permission,
          }
        ]
      });
      if (!user) {
        throw new AuthException();
      }
      let authorized = false;
      if (!permissions) {
        authorized = true;
      }
      if (!roles || UserRole.SUPERUSER === user.role.name) {
        authorized = true;
      }
      permissions?.map(permission => {
        if (user.additionalPermissions?.map(permission => permission.name).indexOf(permission) >= 0) {
          authorized = true;
        }
      });
      roles?.map(role => {
        if (user.role.name === role) {
          authorized = true;
        }
      });
      if (!authorized) {
        throw new AuthException();
      }
      
      const now = moment();
      const newExp = now.clone().add(3, 'hours');
      const newExpIn = newExp.diff(now, 'seconds');
      this.cacheService.expire(`${AuthGuard.TOKEN_CACHE_PREFIX}${token}`, newExpIn);
      
      req.user = user;
      return true;
    } catch (e) {
      console.error(e);
      if (e && e instanceof BaseHttpException) {
        throw e;
      }
      throw new AuthException();
    }
  }
}
