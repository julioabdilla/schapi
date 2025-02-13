import { Article } from "@/modules/article/entities/article.entity";
import { Gallery } from "@/modules/gallery/entities/gallery.entity";
import { GalleryItem } from "@/modules/gallery/entities/gallery_item.entity";
import { Media } from "@/modules/media/entities/media.entity";
import { Staff } from "@/modules/staff/entities/staff.entity";
import { Permission } from "@/modules/user/entities/permission.entity";
import { Role } from "@/modules/user/entities/role.entity";
import { RolePermission } from "@/modules/user/entities/role_permission.entity";
import { User } from "@/modules/user/entities/user.entity";
import { UserPermission } from "@/modules/user/entities/user_permission.entity";
import { ConfigService } from "@nestjs/config";
import { Sequelize } from "sequelize-typescript";

export const providers = [
  {
    provide: 'SEQUELIZE',
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => {
      const sequelize = new Sequelize(config.get<string>('DB_NAME'), config.get<string>('DB_USERNAME'), config.get<string>('DB_PASSWORD'), {
        dialect: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        database: config.get<string>('DB_NAME'),
        dialectOptions: {
          connectTimeout: 30000,
        },
        pool: {
          max: 100,
          min: 0,
          idle: 10000,
        },
      });
      sequelize.addModels([
        Article,
        Gallery,
        GalleryItem,
        Media,
        Permission,
        Role,
        RolePermission,
        Staff,
        User,
        UserPermission,
      ]);
      await sequelize.sync();
      return sequelize;
    },
  },
]
