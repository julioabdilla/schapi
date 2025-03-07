import * as moment from "moment";
import { v4 as uuid } from "uuid";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { Permission } from "./entities/permission.entity";
import { Role } from "./entities/role.entity";
import { CreateUser } from "./dto/create_user.dto";
import { Sequelize } from "sequelize-typescript";
import { StringUtils } from "@/shared/utils";
import { Scrypt } from "@/shared/crypto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserService {
  private logger = new Logger(this.constructor.name);

  constructor(
    private readonly config: ConfigService,
    @Inject(User.name)
    private readonly userRepository: typeof User,
    @Inject(Role.name)
    private readonly roleRepository: typeof Role,
    @Inject(Permission.name)
    private readonly permissionRepository: typeof Permission,
  ) {}

  async createUser(data: CreateUser) {
    const now = moment();
    try {
      if (!data.password) {
        data.password = StringUtils.random(8);
      }
      const hashedPassword = await Scrypt.hash(data.password, this.config.get<string>('PASS_SALT'));
      const user = this.userRepository.build();
      const role = await this.roleRepository.findOne({
        where: {
          name: data.role
        }
      });
      user.roleId = role.id;
      user.name = data.name;
      user.username = data.email;
      user.password = hashedPassword;
      await user.save();
      return {
        name: user.name,
        email: user.username,
        password: data.password,
      };
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
