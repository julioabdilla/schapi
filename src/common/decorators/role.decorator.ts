import { SetMetadata } from "@nestjs/common";
import { UserRole } from "../enums/user_role.enum";

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', Array.isArray(roles) ? roles : [roles]);
