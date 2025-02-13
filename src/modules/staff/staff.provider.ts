import { StaffService } from "./staff.service";
import { Staff } from "./entities/staff.entity";

export const providers = [
  {
    provide: Staff.name,
    useValue: Staff
  },
  StaffService,
]
