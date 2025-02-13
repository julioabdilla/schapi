import { SetMetadata } from "@nestjs/common";

export const Permissions = (...permissions: string[]) => SetMetadata('permissions', Array.isArray(permissions) ? permissions : [permissions]);
