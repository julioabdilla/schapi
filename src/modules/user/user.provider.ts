import { Permission } from "./entities/permission.entity";
import { Role } from "./entities/role.entity";
import { RolePermission } from "./entities/role_permission.entity";
import { User } from "./entities/user.entity";
import { UserPermission } from "./entities/user_permission.entity";
import { UserService } from "./user.service";

export const providers = [
  {
    provide: User.name,
    useValue: User
  },
  {
    provide: Permission.name,
    useValue: Permission
  },
  {
    provide: UserPermission.name,
    useValue: UserPermission
  },
  {
    provide: Role.name,
    useValue: Role
  },
  {
    provide: RolePermission.name,
    useValue: RolePermission
  },
  UserService,
]
