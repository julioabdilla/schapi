import { UserRole } from "@/common/enums/user_role.enum";

export class CreateUser {
  name: string;
  email: string;
  role: UserRole;
}